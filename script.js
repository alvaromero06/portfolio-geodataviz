"use strict";
/*
  AJOUTER UNE CARTE :
  Remplacer un objet exemple par une véritable réalisation vérifiée.
  image : chemin local, ex. "images/carte01.jpg" (ou URL fiable).
  Les cartes ci-dessous sont des EMPLACEMENTS VIDES, pas des analyses inventées.
*/
const cartes = Array.from({length:15},(_,i)=>({
  id:i+1,
  semaine:i+1,
  titre:`Carte à découvrir — semaine ${String(i+1).padStart(2,"0")}`,
  categorie:["Statique","Interactive","Animée"][i%3],
  theme:["Sémiologie graphique","Exploration spatiale","Dynamique temporelle"][i%3],
  description:"Cette fiche sera complétée après sélection et vérification d'une géovisualisation.",
  auteur:"",
  source:"",
  url:"",
  image:"",
  fond:"",
  forme:"",
  regard:"",
  publie:false
}));
/*
EXEMPLE DE FICHE RÉELLE (à renseigner après recherche) :
cartes[0] = {
  id:1, semaine:1, titre:"Titre exact", categorie:"Interactive",
  theme:"Mobilités", description:"Courte présentation",
  auteur:"Auteur vérifié", source:"Publication exacte",
  url:"https://exemple.org/carte", image:"images/carte01.jpg",
  fond:"Pourquoi le sujet est intéressant...",
  forme:"Comment la carte représente les données...",
  regard:"Apport et limites...", publie:true
};
*/
cartes[0] = {
  id: 1,
  semaine: 1,
  titre: "Les déplacements dans le métro de New York",
  categorie: "Interactive",
  theme: "Transports et mobilités",
  description: "Une géovisualisation des déplacements en métro à New York au fil de la journée.",
  auteur: "Peter Atwood (Esri)",
  source: "A Day on the New York City Subway ; article de Robby Deming sur Maps.com",
  url: "https://storymaps.arcgis.com/stories/b1465b5130eb4ca99a647d0a515df142",
  image: "images/metro-new-york.png",
  fond: "J'ai choisi cette géovisualisation parce que je m'intéresse particulièrement au domaine des transports et aux déplacements des personnes dans les grandes villes. C'est donc le sujet de cette carte qui a attiré mon attention. Elle permet de comprendre comment les habitants de New York utilisent le métro au cours d'une journée, notamment les déplacements vers Manhattan le matin et vers les autres quartiers le soir. Je trouve intéressant de voir comment les données de transport peuvent montrer les habitudes de déplacement et le fonctionnement d'une grande ville.",
  forme: "Cette réalisation utilise plusieurs représentations cartographiques, notamment des cartes de flux, des animations et des visualisations en 3D. Les déplacements sont représentés à différents moments de la journée, ce qui permet de comparer les situations. J'ai particulièrement apprécié le côté interactif, car on peut explorer certaines stations et consulter des informations sur leur fréquentation. La visualisation rend des données assez complexes plus faciles à comprendre.",
  regard: "Les flux représentés donnent une vue d'ensemble intéressante, mais la quantité de lignes peut rendre certains déplacements difficiles à distinguer.",
  publie: true
};
const gallery=document.querySelector("#gallery");
const resultCount=document.querySelector("#resultCount");
const statCount=document.querySelector("#statCount");
const searchInput=document.querySelector("#searchInput");
const dialog=document.querySelector("#detailDialog");
let activeFilter="Toutes";
const normalize=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function render(){
  const term=normalize(searchInput.value.trim());
  const items=cartes.filter(c=>(activeFilter==="Toutes"||c.categorie===activeFilter)&&normalize([c.titre,c.theme,c.description,c.auteur].join(" ")).includes(term));
  resultCount.textContent=`${items.length} réalisation${items.length>1?"s":""} affichée${items.length>1?"s":""}`;
  statCount.textContent=String(cartes.filter(c=>c.publie).length).padStart(2,"0");
  gallery.replaceChildren();
  if(!items.length){const empty=document.createElement("p");empty.className="empty";empty.textContent="Aucune carte ne correspond à votre recherche.";gallery.append(empty);return}
  for(const c of items){
    const article=document.createElement("article");article.className="map-card";
    const visual=document.createElement("div");visual.className="card-visual";
    if(c.image){const img=document.createElement("img");img.src=c.image;img.alt=`Illustration : ${c.titre}`;img.loading="lazy";visual.append(img)}
    else{const placeholder=document.createElement("span");placeholder.className="placeholder";placeholder.textContent=["◎","⌁","◈"][c.id%3];visual.append(placeholder)}
    const tag=document.createElement("span");tag.className="week-tag";tag.textContent=`SEMAINE ${String(c.semaine).padStart(2,"0")}`;visual.append(tag);
    const body=document.createElement("div");body.className="card-body";
    const type=document.createElement("span");type.className="card-type";type.textContent=c.categorie+" · "+c.theme;
    const title=document.createElement("h3");title.textContent=c.titre;
    const desc=document.createElement("p");desc.textContent=c.description;
    const meta=document.createElement("div");meta.className="card-meta";
    const status=document.createElement("span");status.textContent=c.publie?"Fiche documentée":"À compléter";
    const btn=document.createElement("button");btn.type="button";btn.textContent="Voir la fiche ↗";btn.setAttribute("aria-label",`Voir la fiche ${c.titre}`);btn.addEventListener("click",()=>openDetail(c));
    meta.append(status,btn);body.append(type,title,desc,meta);article.append(visual,body);gallery.append(article)
  }
}
function line(parent,label,value){if(!value)return;const h=document.createElement("h3");h.textContent=label;const p=document.createElement("p");p.textContent=value;parent.append(h,p)}
function openDetail(c){
  const box=document.querySelector("#dialogContent");box.replaceChildren();
  const label=document.createElement("span");label.className="dialog-label";label.textContent=`Semaine ${c.semaine} · ${c.categorie}`;
  const title=document.createElement("h2");title.id="dialogTitle";title.textContent=c.titre;box.append(label,title);
  if(c.image){const img=document.createElement("img");img.src=c.image;img.alt=`Illustration : ${c.titre}`;box.append(img)}
  line(box,"Présentation",c.description);line(box,"Auteur",c.auteur);line(box,"Source",c.source);line(box,"Sur le fond",c.fond);line(box,"Sur la forme",c.forme);line(box,"Regard critique",c.regard);
  if(c.url){const a=document.createElement("a");a.href=c.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Consulter la carte originale ↗";box.append(a)}
  if(!c.publie){const p=document.createElement("p");p.textContent="Fiche en cours de préparation : les informations et sources seront ajoutées après vérification.";box.append(p)}
  dialog.showModal()
}
document.querySelector("#closeDialog").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>{b.classList.toggle("active",b===btn);b.setAttribute("aria-pressed",String(b===btn))});
  render()
}));
searchInput.addEventListener("input",render);
const menuButton=document.querySelector("#menuButton"),nav=document.querySelector(".nav nav");
menuButton.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(opened))});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}));
render();
