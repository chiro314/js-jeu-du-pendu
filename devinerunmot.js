



const selectMinLettres = document.getElementById("select-min-lettres");
const selectMaxLettres = document.getElementById("select-max-lettres");
const selectNiveau = document.getElementById("select-niveau");
const divMotMystere = document.getElementById("mot-mystere");
const btCommencer = document.getElementById("bt-commencer"); 
const divPupitre = document.getElementById("div-pupitre");
const inputLettre = document.getElementById("input-lettre"); 
const btProposer = document.getElementById("bt-proposer");
const divPendu = document.getElementById("div-pendu");
const pTitre = document.getElementById("p-titre");
const canvas = document.getElementById('canvas');
const divMessage = document.getElementById("div-message");
const divHorsCanvas = document.getElementById('div-hors-canvas');
const btAbandonner = document.getElementById("bt-abandonner");
const divDejaJoues = document.getElementById('div-deja-joues');


const pendu = ['branche1', 'branche2','branche3','branche4','branche5','branche6','branche7','branche8','branche9','branche10'];
var nbBranchesMax = pendu.length;

const banque1 = ["angle", "armoire", "banc", "bureau", "cabinet", "carreau", "chaise", "classe", "clé", "coin", "couloir", "dossier", "eau", "école", "écriture", "entrée", "escalier", "étagère", "étude", "extérieur", "fenêtre", "intérieur", "lavabo", "lecture", "lit", "marche", "matelas", "maternelle", "meuble", "mousse", "mur", "peluche", "placard", "plafond", "porte", "portemanteau", "poubelle", "radiateur", "rampe", "récréation", "rentrée", "rideau", "robinet", "salle", "savon", "serrure", "serviette", "siège", "sieste", "silence", "sol", "sommeil", "sonnette", "sortie", "table", "tableau", "tabouret", "tapis", "tiroir", "toilette", "vitre"];

var banqueCopie = banque1.slice();
var minLettres = selectMinLettres.value;
var maxLettres = selectMaxLettres.value;
var rechargerBanque = false;

var motsDejaJoues = [];
var motsNonTrouves = [];
var niveau = 9; //nombre d'erreurs permises

var partieCommencee = false;
var partieTerminee = true;
var tabPupitre = [];
var motAdeviner = ""; 
var nbLettresTrouvees = 0;
var nbBranches = 0; //correspond aux nombres de branches déjà dessinée.

//Init banque :
var banque = banqueCopie.slice();

//Init mots déjà joués :
afficherMotsDejaJoues();

function afficherMotsDejaJoues(){
    divDejaJoues.innerHTML="";
    for(i=0;i<motsDejaJoues.length;i++) {
        var perdu = false;
        for(j=0;j<motsNonTrouves.length;j++) if(motsNonTrouves[j]==motsDejaJoues[i]) perdu = true;
        if (perdu) divDejaJoues.innerHTML+='<p class="texte-barre">'+ motsDejaJoues[i] +"</p>";
        else divDejaJoues.innerHTML+="<p>"+ motsDejaJoues[i] +"</p>";
    }
}

selectMinLettres.addEventListener("change", function(){
    if (partieCommencee == false) {
        rechargerBanque = true;
        if (motAdeviner == "changerDeNiveau") motAdeviner = "niveauMaj"; 
    }
    else selectMinLettres.value = minLettres;
}, false);
selectMaxLettres.addEventListener("change", function(){
    if (partieCommencee == false) {
        rechargerBanque = true;
        if (motAdeviner == "changerDeNiveau") motAdeviner = "niveauMaj"; 
    }
    else selectMaxLettres.value = maxLettres;
}, false);

selectNiveau.addEventListener("change", function(){
    if (!partieCommencee) initPendu();
    else selectNiveau.value = niveau;
}, false);

function initPendu(){
    niveau = selectNiveau.value;
        nbBranches=nbBranchesMax-1-niveau;
        dessinerPendu(nbBranches);
        
        pTitre.innerHTML="PENDU niveau "+niveau;
        divMessage.innerHTML="";
}

btCommencer.addEventListener("click", function(){
    if(motAdeviner != "changerDeNiveau" && partieTerminee) jouer();

    //event.preventDefault();
    //event.stopPropagation();
    //console.log(event);
}, false);

function jouer(){
    partieCommencee = true;
    partieTerminee = false;
    tabPupitre = [];
    motAdeviner = "";
    nbLettresTrouvees = 0;
    divMessage.innerHTML="";
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    divHorsCanvas.innerHTML="";

    initPendu();

    //Construire la banque (taille des mots) :
    if(rechargerBanque){
        minLettres = selectMinLettres.value;
        maxLettres = selectMaxLettres.value;
        banque=[];

        for(i=0;i<banqueCopie.length;i++){
            if(minLettres <= banqueCopie[i].length && banqueCopie[i].length <= maxLettres)
                banque.push(banqueCopie[i]);
        }
        rechargerBanque = false;
        if(banque.length==0) Alert ("banque.length==0");
    }
    //Construire la banque (retirer les mots déjà joués) : 
    for(i=0;i<motsDejaJoues.length;i++) retirerDeLaBanque(motsDejaJoues[i]);
    
    motAdeviner = choisirUnMot(banque);
    
    if (motAdeviner == "changerDeNiveau"){
        divMessage.innerHTML="Changez de niveau";
        partieTerminee = true;
        partieCommencee = false;
    }
    else{
        motsDejaJoues.push(motAdeviner);
        retirerDeLaBanque(motAdeviner);
        divMotMystere.innerHTML=motAdeviner;
        
        //Afficher les emplacements des lettres à deviner :
        tabPupitre = [];
        for (i=0; i<motAdeviner.length; i++){
            //divPupitre.innerHTML+= "_ ";
            tabPupitre[i] = "_";
        }
        divPupitre.innerHTML=""; divPupitre.innerHTML= tabPupitre; 
        inputLettre.focus();
    }
}

function retirerDeLaBanque(mot){
    var index = banque.findIndex((element) => element == mot);
    if( index != -1) banque.splice(index,1);
}

btAbandonner.addEventListener("click", function(){
    if (partieCommencee && motAdeviner != "changerDeNiveau") {
        abandonner();
    }
}, false);

function abandonner(){
    
    partieCommencee = false;
    partieTerminee = true;
    divMessage.innerHTML="Vous avez abandonné la partie";
    motsNonTrouves.push(motAdeviner);
    afficherMotsDejaJoues();
    inputLettre.value = "";
}

function choisirUnMot(banque){
    if(banque.length==0) return "changerDeNiveau";
    else{
        //Chercher dans la banque :
        
        nombreAleatoire = Math.floor(Math.random() * (banque.length - 1));
            
        return banque[nombreAleatoire];
    }
}

btProposer.addEventListener("click", function(){
    
    if(nbBranches < nbBranchesMax && partieTerminee == false && motAdeviner != "changerDeNiveau"){

        var lettreProposee = inputLettre.value;
       
        lettreProposee = lettreProposee[0];
        lettreProposee = lettreProposee.toLowerCase();
        inputLettre.value = lettreProposee;

        var trouve = false;
        
        for(i=0; i<tabPupitre.length; i++){
            if(motAdeviner[i]==lettreProposee && tabPupitre[i] == "_"){
                tabPupitre[i] = lettreProposee;
                nbLettresTrouvees+=1;
                trouve = true;
                divPupitre.innerHTML=""; divPupitre.innerHTML= tabPupitre; 
                inputLettre.focus();
            }
        }
        if (trouve == false) {
            nbBranches+=1;
            dessinerPendu(nbBranches);
        }
        else if(nbLettresTrouvees==motAdeviner.length){
            divMessage.innerHTML="Vous avez gagné";
            inputLettre.value = "";
            partieTerminee = true;
            partieCommencee = false;
            afficherMotsDejaJoues();
        }
        else {
            inputLettre.value = "";
            inputLettre.focus();
        }
    }
}, false);

function dessinerPendu(nbBranchesAdessiner){
    inputLettre.value = "";
    
    if (canvas.getContext) {
    //if (false) {
        // code de dessin dans le canvas
        //https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial
        //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
        //http://blog.lecomte.me/posts/2012/effacer-canvas-trick/
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(i=0;i<nbBranchesAdessiner; i++ ) dessiner(i);
    } 
    else {
        
        // code pour le cas où canvas ne serait pas supporté
        canvas.style.display="none";
    
        divHorsCanvas.innerHTML="";
        for(i=0;i<nbBranchesAdessiner; i++ ) {
            divHorsCanvas.innerHTML+="<p>"+ pendu[i] +"</p>";
        }

        /*switch(niveau.toString()){
            case '1' : 
                divPendu.innerHTML+="<p>"+ pendu[nbBranches] +"</p>";
                nbBranches+=1;
                break;
        */
    }
    if(nbBranches == nbBranchesMax){
        inputLettre.value = "";
        partieTerminee = true;
        partieCommencee = false;
        divMessage.innerHTML="Vous avez perdu la partie";
        motsNonTrouves.push(motAdeviner);
        afficherMotsDejaJoues();
    } 
    else if (partieCommencee){
        inputLettre.value = "";
        inputLettre.focus();
    }
}

function dessiner(i){
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "black";
    switch(i){
        case 0 :           
            ctx.fillRect(60,130, 170, 5);
        break;
        case 1 :           
            ctx.fillRect(185,20, 10, 110);
        break;
        case 2 :           
            ctx.fillRect(90,20, 100, 5);
        break;
        case 3 :           
            ctx.beginPath();
            ctx.moveTo(150, 25);
            ctx.lineTo(190, 50);
            ctx.closePath();
            ctx.stroke();
        break;
        case 4 :           
            ctx.fillRect(90,20, 5, 15);
        break;
        case 5 :           
            ctx.beginPath();
            ctx.arc(92, 45, 10, 0, 2 * Math.PI);
            ctx.fill();  //ou ctx.stroke() pour les formes vide. Nb : ctx.closePath() est compris dans ctx.fill()
        break;
        case 6 :           
            ctx.fillRect(90,20, 5, 60);
        break;
        case 7 :           
            ctx.fillRect(60,60, 65, 2);
        break;
        case 8 :           
            ctx.beginPath();
            ctx.moveTo(90, 80);
            ctx.lineTo(70, 100);
            ctx.closePath();
            ctx.stroke();
        break;
        case 9 :           
            ctx.beginPath();
            ctx.moveTo(95, 80);
            ctx.lineTo(120, 100);
            ctx.closePath();
            ctx.stroke();
        break;
    }
}

//boutons radio
//https://www.techiedelight.com/fr/bind-change-event-handler-radio-button-javascript/

var CAS = "";
const fileElem = document.getElementById("fileElem");
fileElem.style.opacity = 0; // ne change rien par rapport à <!--style="display:none"-->

const radios = document.querySelectorAll('input[type=radio][name="theme"]');
radios.forEach(radio => radio.addEventListener('change', (event) => 
    lancerImputFile(radio.value)
));

function lancerImputFile(cas){
    CAS = cas; 
    //alert("CAS : "+CAS);
    divMessage.innerHTML=""; 
    if (fileElem) fileElem.click();
    else divMessage.innerHTML="fileElem : "+fileElem;
}

fileElem.onchange = function() {
    const reader = new FileReader(); //change-t-il qlq chose par rapport à var ??
    reader.onload = function() {
        //alert('Contenu du fichier "' + fileInput.files[0].name + '" :\n\n' + reader.result);
           
        //divMessage.innerHTML="fileElem.files[0].name : "+ fileElem.files[0].name + "   CAS+ .txt : "+CAS+".txt";
        if(fileElem.files[0].name != CAS+".txt") {
            //KO si on passe 2 fois sur le même fichier :
                //divMessage.innerHTML="Vous vous êtes trompé de fichier";
                //idem KO : il ne se passe rien
                var id = fileElem.files[0].name;
                id = id.replace('.txt', '');
                id = "fileSelect-"+id;
                divMessage.innerHTML=id;
                document.getElementById(id).checked=true;
        }
        else {
            var resultat=reader.result;
            var monTab = resultat.split(String.fromCharCode(13)+String.fromCharCode(10));
            divMessage.innerHTML="monTab[1] : "+monTab[1];
            banqueCopie = monTab.slice();
            finChoixTheme();
            
        }
    }
    reader.readAsText(fileElem.files[0]);
};

function finChoixTheme(){
    rechargerBanque = true;
            divDejaJoues.innerHTML="";
            motsDejaJoues = []; 
}

/*

const fileSelectClasseNoms = document.getElementById("fileSelect-classe-noms");
const fileElemClasseNoms = document.getElementById("fileElemClasseNoms");
fileSelectClasseNoms.addEventListener("click", (e) => {
    if (fileElemClasseNoms) fileElemClasseNoms.click();
}, false);
fileElemClasseNoms.onchange = function() {
    var reader = new FileReader();
    reader.onload = function() {
        //alert('Contenu du fichier "' + fileInput.files[0].name + '" :\n\n' + reader.result);
        var resultat=reader.result;
        var monTab = resultat.split(String.fromCharCode(13)+String.fromCharCode(10));
        alert("monTab[1] : "+monTab[1]);
    };
    reader.readAsText(fileElemClasseNoms.files[0]);
};

const fileSelectTravailVerbes = document.getElementById("fileSelect-travail-verbes");
const fileElemTravailVerbes = document.getElementById("fileElemTravailVerbes");
fileSelectTravailVerbes.addEventListener("onclick", (e) => {
    if (fileElemTravailVerbes) fileElemTravailVerbes.click();
}, false);
fileElemTravailVerbes.onchange = function() {
    var reader = new FileReader();
    reader.onload = function() {
        //alert('Contenu du fichier "' + fileInput.files[0].name + '" :\n\n' + reader.result);
        var resultat=reader.result;
        var monTab = resultat.split(String.fromCharCode(13)+String.fromCharCode(10));
        alert("monTab[1] : "+monTab[1]);
    };
    reader.readAsText(fileElemTravailVerbes.files[0]);
};

*/





/* OK clean mais on va essayer les boutons radio (ci-dessus)

const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("fileElem");

fileSelect.addEventListener("click", (e) => {
  if (fileElem) fileElem.click();
}, false);

fileElem.onchange = function() {
    var reader = new FileReader();
    reader.onload = function() {
        //alert('Contenu du fichier "' + fileInput.files[0].name + '" :\n\n' + reader.result);
        var resultat=reader.result;
        var monTab = resultat.split(String.fromCharCode(13)+String.fromCharCode(10));
        alert("monTab[1] : "+monTab[1]);
    };
    reader.readAsText(fileElem.files[0]);
};
*/

/* Solution 1 : OK mais moche
//https://yard.onl/sitelycee/cours/js/_Js.html?Lirelesfichiers.html 
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

*/
var fileInput = document.querySelector('#input-file');
//fileInput.style.opacity = 0;

fileInput.onchange = function() {
    var reader = new FileReader();
    divMessage.innerHTML="";
    reader.onload = function() {
        //alert('Contenu du fichier "' + fileInput.files[0].name + '" :\n\n' + reader.result);
        var resultat=reader.result;
        var monTab = resultat.split(String.fromCharCode(13)+String.fromCharCode(10));
        divMessage.innerHTML="monTab[1] : "+monTab[1];
        banqueCopie = monTab.slice();
        finChoixTheme();
    };
    reader.readAsText(fileInput.files[0]);
};



/* KO
//https://www.journaldunet.fr/web-tech/developpement/1202851-comment-developper-un-lecteur-de-fichier-texte-en-javascript/#:~:text=Pour%20pouvoir%20lire%20un%20fichier%20situ%C3%A9%20sur%20un%20ordinateur%2C%20nous,un%20fichier%20de%20l%27ordinateur.

function lireFichierTexte(fichier)
{
    //On lance la requête pour récupérer le fichier
    var fichierBrut = new XMLHttpRequest();
    fichierBrut.open("GET", fichier, false);
    //On utilise une fonction sur l'événement "onreadystate"
    fichierBrut.onreadystatechange = function (){
        if(fichierBrut.readyState === 4) {
            //On contrôle bien quand le statut est égal à 0
            if(fichierBrut.status === 200 || fichierBrut.status == 0){
                //On peut récupérer puis traiter le texte du fichier
                var texteComplet = fichierBrut.responseText;
                alert(texteComplet);
            }
        }
    }
    fichierBrut.send(null);
}

//lireFichierTexte("file:///C:/votre/chemin/vers/le/fichier.txt");
// "C:\Users\Stagiaire DevWeb\Desktop\DEVELOPPEUR\EXERCICES\EXO-JS\11-Exo-chaines de caractère - pendu\TP-Jeu du pendu\CANEVAS\Saisie nb erreurs\FICHIERS\classe-noms.txt"
lireFichierTexte("file:///C:\Users\Stagiaire DevWeb\Desktop\DEVELOPPEUR\EXERCICES\EXO-JS\11-Exo-chaines de caractère - pendu\TP-Jeu du pendu\CANEVAS\Saisie nb erreurs\FICHIERS\classe-noms.txt");
*/

/* KO (moi)
const inputTheme1 = document.getElementById("input-theme1"); 
const inputFile = document.getElementById("input-file"); 

inputTheme1.addEventListener("change", function(){
    var alors = inputTheme1.checked;
    //alert ("alors : "+ alors);
    if (alors) {
        //alert ("inputTheme1.checked");
        var valeur = inputTheme1.value;
        alert ("inputTheme1.value : "+inputTheme1.value);
        alert ("valeur : " +valeur);
        inputFile.value = "e.txt"; //KO : on ne peut que renseigner "" (chaine vide)
        alert("inputFile.value = vide : " +inputFile.value)
    }
    else alert("RAS");
}, false);
*/