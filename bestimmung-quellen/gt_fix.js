// Von Hand korrigierte und ins Deutsche übertragene Tabellen aus Giglio-Tos 1927 (Das Tierreich 50).
// Schlüssel = Zeilennummer der Tabelle im Textauszug. Jedes Paar: [a, b]; Element: [Text, Ziel]
// Ziel: Zahl = Paar; "SF:Name" Unterfamilie; "GRP:Name" Gruppe; "G:Name" Gattung; "A:epitheton" Art.
"use strict";
const FIX = {};
// Begriffe (für Laien):
//  Scheibendornen = Dornen auf der Innenfläche des Vorderschenkels nahe seiner Basis (zwischen Außen- und Innenreihe)
//  Stirnschild    = glatte Platte im Gesicht zwischen den Fühleransätzen und der Oberlippe
//  Afterdeckplatte = Platte oben über dem Hinterleibsende, zwischen den Cerci
FIX[2376] = { t: "Unterfamilien (Giglio-Tos 1927)", c: [
  [["Vorderschiene außen ohne Dornen, zumindest ohne den Enddorn außen an der Spitze", "SF:Perlamantinae"], ["Vorderschiene außen mit Dornen, mindestens mit dem Enddorn", 2]],
  [["Innenreihe des Vorderschenkels: große und kleine Dornen wechseln sich regelmäßig ab (groß – klein – groß – klein)", 3], ["Innenreihe des Vorderschenkels: auf jeden großen Dorn folgen drei kleine", "SF:Empusinae"]],
  [["Hinterschienen glatt, ohne Längsleiste", 4], ["Hinterschienen oben mit einer scharfen Längsleiste (Kiel)", "SF:Vatinae"]],
  [["Vorderschiene oben ohne Dornen", 5], ["Vorderschiene oben an der Spitze mit Dornen", "SF:Oligonicinae"]],
  [["Vorderschenkel außen mit 5–7 Dornen", 6], ["Vorderschenkel außen mit genau 4 Dornen", 16]],
  [["Erster Scheibendorn des Vorderschenkels länger als der zweite", "SF:Schizocephalinae"], ["Erster Scheibendorn kürzer als der zweite", 7]],
  [["Cerci (Hinterleibsanhänge) blattartig flach verbreitert", "SF:Toxoderinae"], ["Cerci kegelförmig oder seitlich zusammengedrückt, nicht blattartig", 8]],
  [["Vorderschenkel mit 3 Scheibendornen", 9], ["Vorderschenkel mit 4 Scheibendornen", 11]],
  [["Vorderschiene außen mit 8–11 Dornen", 10], ["Vorderschiene außen mit 12 oder mehr Dornen", "SF:Acontistinae"]],
  [["Stirnschild deutlich breiter als hoch (quer)", "SF:Photininae"], ["Stirnschild fast quadratisch", "SF:Eremiaphilinae"]],
  [["Afterdeckplatte sehr lang, lanzenspitzenförmig", "SF:Eufischeriellinae"], ["Afterdeckplatte nicht lanzenspitzenförmig verlängert", 12]],
  [["Vorderschiene außen mit 6–11 Dornen", 13], ["Vorderschiene außen mit 12 oder mehr Dornen", 14]],
  [["Vorderschenkel stark verbreitert, im Umriss oval", "SF:Oxypilinae"], ["Vorderschenkel wenig verbreitert, im Umriss dreieckig", "SF:Dystactinae"]],
  [["Augen spitz ausgezogen und Hinterschenkel mit Lappen", "SF:Epaphroditinae"], ["Augen gerundet und Hinterschenkel ohne Lappen", 15]],
  [["Stirnschild deutlich breiter als hoch (quer)", "SF:Photininae"], ["Stirnschild fast quadratisch", "SF:Eremiaphilinae"]],
  [["Vorderhüfte an der Spitze vorn zu einem kleinen Lappen erweitert", 17], ["Vorderhüfte an der Spitze nicht erweitert", 18]],
  [["Vorderschenkel dreieckig verbreitert, weniger als dreimal so lang wie breit", "SF:Pseudomiopteriginae"], ["Vorderschenkel schlank, mehr als dreimal so lang wie breit", "SF:Thespinae"]],
  [["Die beiden mittleren Außendornen des Vorderschenkels deutlich länger als die übrigen", "SF:Schizocephalinae"], ["Die beiden mittleren Außendornen nicht länger als die übrigen", 19]],
  [["Vorderschiene außen mit 4–5 Dornen", 20], ["Vorderschiene außen mit 6 oder mehr Dornen", 22]],
  [["Die Furche, in die sich die Schienenklaue legt, liegt weit von der Basis des Vorderschenkels entfernt", 21], ["Diese Klauenfurche liegt ganz nahe an der Basis des Vorderschenkels", "SF:Eremiaphilinae"]],
  [["Scheitel ohne Fortsatz", "GRP:Parathespes"], ["Scheitel in einen langen, dreieckigen Fortsatz ausgezogen", "SF:Eremiaphilinae"]],
  [["Seitenränder des Halsschilds fast parallel oder nach vorn auseinanderlaufend", "SF:Eremiaphilinae"], ["Seitenränder des Halsschilds nach vorn zusammenlaufend", 23]],
  [["Außendornen der Vorderschiene gerade abstehend, mit Abstand zueinander", 24], ["Außendornen der Vorderschiene zahlreich, dicht gedrängt und schräg anliegend", 47]],
  [["Vorderschenkel mit 1–3 Scheibendornen", 25], ["Vorderschenkel mit 4 Scheibendornen", 26]],
  [["Die beiden inneren Endlappen der Vorderhüfte spreizen auseinander", "SF:Iridopteriginae"], ["Die beiden inneren Endlappen der Vorderhüfte liegen aneinander", "SF:Eufischeriellinae"]],
  [["Vorderschenkel außen zwischen 1. und 2. Außendorn mit einem Grübchen, in das sich die Spitze der Schienenklaue legt", 27], ["Vorderschenkel ohne dieses Grübchen", 31]],
  [["Scheibendornen im Zickzack angeordnet", "SF:Liturgusinae"], ["Scheibendornen in gerader Linie", 28]],
  [["Außendornen des Vorderschenkels sehr lang und gebogen", 29], ["Außendornen des Vorderschenkels kurz und gerade", "SF:Sibyllinae"]],
  [["Halsschild ohne Höcker", "SF:Caliridinae"], ["Halsschild mit 2 Höckern auf dem vorderen Teil des hinteren Abschnitts (hinter der Querfurche)", 30]],
  [["Hinterschenkel unten nahe der Spitze mit einem Läppchen oder Zahn", "SF:Majanginae"], ["Hinterschenkel einfach", "SF:Mellierinae"]],
  [["Scheitel in einen Fortsatz (Höcker oder Horn) verlängert", "SF:Oxypilinae"], ["Scheitel ohne Fortsatz", 32]],
  [["Mittel- und Hinterschienen oder -schenkel unten mit einigen kleinen Dornen", 33], ["Mittel- und Hinterbeine unten ohne Dornen", 34]],
  [["Stirnschild deutlich breiter als hoch; Hinterflügel ohne dunkle Querbinden im mittleren Feld", "SF:Eufischeriellinae"], ["Stirnschild kaum breiter als hoch; Hinterflügel im mittleren Feld mit schwarzen Querbinden", "SF:Mantinae"]],
  [["Seitenränder des Halsschilds stark blattartig verbreitert", 35], ["Seitenränder des Halsschilds nicht verbreitert", 37]],
  [["Hinterschenkel ohne Lappen", 36], ["Hinterschenkel mit Lappen", "SF:Deroplatinae"]],
  [["Erstes Fußglied der Hinterbeine glatt", "SF:Choeradodinae"], ["Erstes Fußglied der Hinterbeine mit Längsleiste", "SF:Mantinae"]],
  [["Augen seitlich kegelförmig, mit einem Dorn an der Spitze", "SF:Oxyothespinae"], ["Augen seitlich gerundet", 38]],
  [["Männchen: Deckflügel und Fühler bewimpert (mit feinen Haaren besetzt)", 39], ["Männchen: Deckflügel und Fühler nicht bewimpert", 41]],
  [["Halsschild strichförmig schmal", "SF:Miopteriginae"], ["Halsschild mehr oder weniger verbreitert", 40]],
  [["Halsschild fast kleeblattförmig, die Ecken der Verbreiterung etwas spitz; Deckflügel der Männchen sehr breit", "SF:Dystactinae"], ["Halsschild mehr oder weniger oval, die Ecken der Verbreiterung gerundet; Deckflügel schmal", "SF:Amelinae"]],
  [["Halsschild kürzer als die Vorderhüften", 42], ["Halsschild mindestens so lang wie die Vorderhüften", 43]],
  [["Hinterflügel farblos", "SF:Amelinae"], ["Hinterflügel farbig", "SF:Compsomantinae"]],
  [["Vorderschiene: der 6. Außendorn (von der Spitze gezählt) länger als der 5.", "SF:Caliridinae"], ["Vorderschiene ohne dieses Merkmal", 44]],
  [["Augen kegelförmig, mit einem Dorn an der Spitze", "SF:Oxyothespinae"], ["Augen nicht kegelförmig", 45]],
  [["Erster Scheibendorn nicht kürzer als der zweite", "SF:Archimantinae"], ["Erster Scheibendorn kürzer als der zweite", 46]],
  [["Afterdeckplatte sehr lang, lanzenspitzenförmig", "SF:Solygiinae"], ["Afterdeckplatte kurz", "SF:Mantinae"]],
  [["Halsschild schlank, mindestens so lang wie die Vorderhüften", 48], ["Halsschild mehr oder weniger verbreitert, kürzer als die Vorderhüften", "SF:Hymenopodinae"]],
  [["Seitenränder des Halsschilds als dünne Lamellen verbreitert", "SF:Epaphroditinae"], ["Seitenränder des Halsschilds nicht verbreitert", "SF:Acromantinae"]],
] };

// Perlamantinae – Gruppe Paraoxypili
FIX[2614] = { c: [
  [["Vorderhüften bei beiden Geschlechtern bedornt (beim Weibchen stärker); Weibchen flügellos", 2], ["Vorderhüften auch beim Weibchen unbedornt oder fast unbedornt; Weibchen geflügelt", 3]],
  [["Vorderrand der Gelenkgrube der Vorderhüften glatt", "G:Paraoxypilus"], ["Vorderrand der Gelenkgrube der Vorderhüften zu einem Dorn erhoben", "G:Myrmecomantis"]],
  [["Fläche des Halsschilds mit Spitzen besetzt", 4], ["Fläche des Halsschilds ohne Spitzen", "G:Phthersigena"]],
  [["Oberkante des Vorderschenkels vor der Spitze plötzlich abgeschnitten", "G:Metoxypilus"], ["Oberkante des Vorderschenkels gleichmäßig gebogen, nicht abgeschnitten", 5]],
  [["Vorderschenkel mit 2 Scheibendornen", "G:Triaenocorypha"], ["Vorderschenkel mit 3 Scheibendornen", "G:Gyromantis"]],
] };
// Eremiaphilinae – Gruppen
FIX[4184] = { c: [
  [["Erster (innerster) Außendorn des Vorderschenkels sehr lang und kräftig, spornartig", "GRP:Metallytici"], ["Erster Außendorn des Vorderschenkels nicht auffallend lang", 2]],
  [["Vorderschenkel unten stark verbreitert, die Unterseite breiter als die Außenseite", "GRP:Mantoidae"], ["Vorderschenkel seitlich zusammengedrückt, die Unterseite schmaler als die Außenseite", 3]],
  [["Deckflügel bei Männchen und Weibchen sehr kurz; letztes Bauchsegment des Weibchens in 2 Spitzen ausgezogen", "GRP:Eremiaphilae"], ["Deckflügel der Männchen lang; letztes Bauchsegment des Weibchens ohne Spitzen", 4]],
  [["Seitenränder des Halsschilds nach vorn auseinanderlaufend: Halsschild wie ein Wappenschild geformt", "GRP:Humbertiellae"], ["Seitenränder des Halsschilds parallel oder fast parallel, kein Wappenschild", 5]],
  [["Cerci mehr oder weniger flachgedrückt", 6], ["Cerci kegelförmig (rund im Querschnitt)", "GRP:Orthoderae"]],
  [["Die Klauenfurche (in die sich die Schienenklaue legt) liegt ganz nahe an der Basis des Vorderschenkels", "GRP:Tarachodes"], ["Die Klauenfurche liegt deutlich von der Schenkelbasis entfernt", 7]],
  [["Scheitel in der Mitte nicht verlängert", 8], ["Scheitel in der Mitte zu einem langen, dreieckigen Fortsatz ausgezogen", "GRP:Pyrgomantes"]],
  [["Die seitlichen Scheitellappen ragen nicht über den Oberrand der Augen", 9], ["Die seitlichen Scheitellappen ragen über den Oberrand der Augen hinaus", "GRP:Euoxyophthalmi"]],
  [["Vorderschenkel verbreitert, Oberkante gerade oder leicht gebogen", "GRP:Episcopi"], ["Vorderschenkel schlank, Oberkante leicht eingebuchtet", "GRP:Dysaules"]],
] };
// Gruppe Humbertiellae
FIX[5512] = { c: [
  [["Augen mit einem Dorn an der Spitze", "G:Oxyelaea"], ["Augen ohne Dorn", 2]],
  [["Vorderrandfeld der Deckflügel viel schmaler als die Hälfte des Mittelfelds", 3], ["Vorderrandfeld der Deckflügel so breit wie die Hälfte des Mittelfelds", 6]],
  [["Ränder des Halsschilds ohne Dornen", 4], ["Ränder des Halsschilds bedornt", "G:Zouza"]],
  [["Halsschild fast so breit wie lang; Deckflügel der Weibchen sehr kurz; Vorderrand der Deckflügel der Männchen bewimpert", "G:Elaea"], ["Halsschild länger als breit; Deckflügel der Weibchen fast so lang wie der Hinterleib", 5]],
  [["Vorderschiene außen mit 9 Dornen, die von der Spitze zur Basis gleichmäßig kürzer werden", "G:Humbertiella"], ["Vorderschiene außen mit 8 Dornen: 5 an der Spitze werden zur Basis hin kürzer, die 3 basalen sind länger als die übrigen", "G:Theopompula"]],
  [["Vorderschiene außen mit 9 Dornen; Vorderrandfeld der Deckflügel beim Weibchen zur Spitze allmählich verschmälert", "G:Theopompa"], ["Vorderschiene außen mit 8 Dornen; Vorderrandfeld der Deckflügel beim Weibchen zur Spitze plötzlich verschmälert", "G:Theopompella"]],
] };
// Iridopteriginae – Gruppen
FIX[8845] = { c: [
  [["Vorderschenkel mit 1–2 Scheibendornen", "GRP:Tarachinae"], ["Vorderschenkel mit 3 Scheibendornen", 2]],
  [["Hinterer Teil des Halsschilds ohne deutlichen Mittelkiel", 3], ["Hinterer Teil des Halsschilds mit deutlichem, erhabenem Mittelkiel", "GRP:Tropidomantes"]],
  [["Zwei Längsadern im Deckflügel (hintere Radialader und erster Ast der Ulnarader) liegen dicht beieinander", "GRP:Iridopteriges"], ["Diese beiden Adern liegen weit auseinander", 4]],
  [["Vorderschiene außen mit 11 Dornen", "GRP:Iridopteriges"], ["Vorderschiene außen mit weniger als 11 Dornen", 5]],
  [["Vorderschiene außen mit 7–9 Dornen", "GRP:Nanomantes"], ["Vorderschiene außen mit 6 Dornen", "GRP:Stenomantes"]],
] };
// Gruppe Iridopteriges
FIX[8970] = { c: [
  [["Breiteste Stelle des Vorderschenkels in der Mitte, die Klauenfurche daher etwa in der Mitte (Arten aus Australien und Afrika)", 2], ["Breiteste Stelle des Vorderschenkels hinter der Mitte, die Klauenfurche ganz nahe der Basis (Arten aus Asien)", 9]],
  [["Deckflügel ohne Scheinadern zwischen den Längsadern", 3], ["Deckflügel mit Scheinadern zwischen den Längsadern (Afrika)", 4]],
  [["Oberkante des Vorderschenkels gerade; Weibchen flügellos (Australien)", "G:Bolbe"], ["Oberkante des Vorderschenkels stark gebogen (Afrika)", "G:Eubolbe"]],
  [["Außendornen der Vorderschiene (außer dem Enddorn) etwa gleich lang", 5], ["Einzelne Außendornen der Vorderschiene (der 5. oder 6. von der Spitze) länger", 8]],
  [["Scheitel neben den Augen ohne Höckerchen", "G:Bolbella"], ["Scheitel neben den Augen mit Höckerchen", 6]],
  [["Mediastinalader der Deckflügel liegt den Radialadern dicht an und teilt das Vorderrandfeld nicht", "G:Bolbula"], ["Mediastinalader von den Radialadern entfernt, sie teilt das Vorderrandfeld in zwei Teile", 7]],
  [["Vorderschiene außen mit 9 Dornen; Mittelkiel des Halsschilds am Hinterrand zu einem Läppchen erhoben", "G:Bolbena"], ["Vorderschiene außen mit 11 Dornen; Mittelkiel nicht erhoben", "G:Bolboda"]],
  [["Längster Außendorn der Vorderschiene ist der 6. (von der Spitze gezählt)", "G:Bolbira"], ["Längster Außendorn der Vorderschiene ist der 5.", "G:Hapalomantis"]],
  [["Stirnschild sehr niedrig, mindestens dreimal so breit wie hoch", 10], ["Stirnschild höchstens doppelt so breit wie hoch", 11]],
  [["Hinterrand des Halsschilds unbewehrt", "G:Micromantis"], ["Hinterrand des Halsschilds mit 2 langen Dornen", "G:Diacanthomantis"]],
  [["Vorderrand des Halsschilds mit zwei kleinen Höckern", "G:Hapalopeza"], ["Vorderrand des Halsschilds ohne Höcker", 12]],
  [["Fühler dünn; Stirnschild breiter als hoch", 13], ["Fühler verdickt; Stirnschild nicht breiter als hoch, sein Oberrand stark gebogen", "G:Spilomantis"]],
  [["Hinterrand des Halsschilds mit zwei spitzen, kegelförmigen Höckern", "G:Hapalopezella"], ["Hinterrand des Halsschilds ohne spitze Höcker", "G:Iridopteryx"]],
] };

// Gruppe Tropidomantes
FIX[9667] = { c: [
  [["Mittelkiel des Halsschilds glatt", 2], ["Mittelkiel des Halsschilds gekerbt", "G:Enicophlebia"]],
  [["Mediastinalader der Deckflügel liegt der vorderen Radialader dicht an, keine Queräderchen dazwischen", 3], ["Mediastinalader von der vorderen Radialader entfernt, dazwischen kleine Queräderchen", 13]],
  [["Deckflügel sehr schmal, kaum so breit wie der Halsschild lang ist", 4], ["Deckflügel breiter", 6]],
  [["Augen gerundet", "G:Nilomantis"], ["Augen seitlich kegelförmig", 5]],
  [["Scheitel gerade", "G:Cryptomantis"], ["Scheitel in der Mitte eingebuchtet", "G:Ilomantis"]],
  [["Vorderschiene außen mit 11–13 Dornen", 7], ["Vorderschiene außen mit weniger als 11 Dornen", 8]],
  [["Scheitel gerade, nicht über die Augen ragend, ohne Höcker neben den Augen", "G:Hyalomantis"], ["Scheitel gerundet, über die Augen ragend, neben jedem Auge ein runder Höcker", "G:Platycalymma"]],
  [["Vorderrandfeld der Deckflügel beim Männchen an der Basis stark verbreitert", "G:Epsomantis"], ["Vorderrandfeld an der Basis nicht stark verbreitert", 9]],
  [["Vorderschiene: 6. Außendorn (von der Spitze) länger als der 5.", 10], ["6. Außendorn nicht länger als der 5.", 12]],
  [["Halsschild kürzer als die Vorderhüften", 11], ["Halsschild mindestens so lang wie die Vorderhüften", "G:Negromantis"]],
  [["Die Zellen des Deckflügel-Adernetzes haben in der Mitte einen undurchsichtigen Fleck", "G:Eomantis"], ["Zellen des Deckflügels ohne solchen Fleck", "G:Tropidomantis"]],
  [["Die Zellen des Deckflügel-Adernetzes haben in der Mitte einen undurchsichtigen Fleck", "G:Neomantis"], ["Zellen des Deckflügels ohne solchen Fleck", "G:Melomantis"]],
  [["Vorderrandfeld der Deckflügel breit, unregelmäßig netzartig geädert", "G:Chiromantis"], ["Vorderrandfeld der Deckflügel sehr schmal, mit weit auseinanderliegenden parallelen Queradern", 14]],
  [["Vorderrandfeld der Deckflügel glasklar", 15], ["Vorderrandfeld der Deckflügel undurchsichtig", "G:Xanthomantis"]],
  [["Vorderschiene außen mit 6–8 Dornen; Halsschild kürzer und weniger schlank", 16], ["Vorderschiene außen mit 9 Dornen; Halsschild länger und schlanker", "G:Mimomantis"]],
  [["Mediastinalader verläuft im Vorderrandfeld etwa in der Mitte zwischen vorderer Radialader und Flügelrand", "G:Miromantis"], ["Mediastinalader liegt näher an der Radialader als am Flügelrand", "G:Ormomantis"]],
] };

// Amelinae – Gruppen
FIX[10946] = { c: [
  [["Afterdeckplatte groß, mindestens so lang wie breit", "GRP:Ameles"], ["Afterdeckplatte kleiner, breiter als lang (quer)", 2]],
  [["Außenkante des Vorderschenkels zwischen den Dornen gekerbt (Arten aus Asien)", "GRP:Gonypetae"], ["Außenkante des Vorderschenkels glatt (Arten aus Afrika)", "GRP:Chroicopterae"]],
] };
// Gruppe Ameles
FIX[10963] = { c: [
  [["Erstes Fußglied der Hinterbeine kürzer als die beiden folgenden Glieder zusammen", 2], ["Erstes Fußglied der Hinterbeine länger als die beiden folgenden zusammen", 3]],
  [["Flügel beim Männchen voll entwickelt, beim Weibchen kurz", "G:Ameles"], ["Flügel auch beim Männchen kurz oder fehlend", "G:Pseudoyersinia"]],
  [["Erstes Fußglied der Hinterbeine kürzer als alle übrigen Glieder zusammen", "G:Yersinia"], ["Erstes Fußglied der Hinterbeine mindestens so lang wie alle übrigen Glieder zusammen", "G:Litaneutria"]],
] };
// Gruppe Gonypetae
FIX[11515] = { c: [
  [["Erstes Fußglied der Hinterbeine länger als die übrigen Glieder zusammen", 2], ["Erstes Fußglied der Hinterbeine nicht länger als die übrigen zusammen", 7]],
  [["Stirnschild fast quadratisch", "G:Amantis"], ["Stirnschild breiter als hoch", 3]],
  [["Stirnschild mit zwei Längskielen", "G:Cimantis"], ["Stirnschild glatt", 4]],
  [["Vorderschiene außen mit 6 Dornen", "G:Dimantis"], ["Vorderschiene außen mit mehr als 6 Dornen", 5]],
  [["Vorderschiene außen mit 9 Dornen", "G:Eumantis"], ["Vorderschiene außen mit 10–11 Dornen", 6]],
  [["Die beiden basalen Außendornen des Vorderschenkels stehen nicht dicht beieinander", "G:Gimantis"], ["Die beiden basalen Außendornen stehen sehr dicht beieinander", "G:Elmantis"]],
  [["Stirnschild nicht breiter als hoch, Oberrand stark gebogen", "G:Gonypeta"], ["Stirnschild breiter als hoch, Oberrand schwächer gebogen", 8]],
  [["Hinterer Teil des Halsschilds in der Mitte mit zwei Höckern", "G:Myrcinus"], ["Hinterer Teil des Halsschilds höchstens etwas beulig, ohne zwei Höcker", 9]],
  [["Die beiden basalen Außendornen des Vorderschenkels stehen nicht dicht beieinander", 10], ["Die beiden basalen Außendornen stehen sehr dicht beieinander", 11]],
  [["Vorderschenkel außen glatt", "G:Armeniola"], ["Vorderschenkel außen gekörnt", "G:Bimantis"]],
  [["Hinterflügel der Männchen: die Diskoidalader zweiästig; Deckflügel der Weibchen sehr kurz", "G:Memantis"], ["Hinterflügel der Männchen: Diskoidalader einfach oder nur gegabelt; Deckflügel der Weibchen so lang wie der Hinterleib", "G:Armene"]],
] };
// Gruppe Chroicopterae (Afrika)
FIX[12239] = { c: [
  [["Hinterer Teil des Halsschilds ohne Mittelkiel", 2], ["Hinterer Teil des Halsschilds mit Mittelkiel", "G:Rhachimantis"]],
  [["Vorderschiene außen mit 9–10 Dornen", 3], ["Vorderschiene außen mit 6–8 Dornen", 5]],
  [["Vorderrand der Deckflügel beim Männchen nicht weiß gesäumt", 4], ["Vorderrand der Deckflügel beim Männchen weiß gesäumt", "G:Betamantis"]],
  [["Vorderrandfeld der Deckflügel beim Männchen durchsichtig", "G:Chroicoptera"], ["Vorderrandfeld der Deckflügel beim Männchen undurchsichtig", "G:Alphamantis"]],
  [["Männchen: einige große Innendornen vor der Spitze des Vorderschenkels viel kräftiger als die übrigen; Weibchen: Halsschild fast kreisrund, Ränder kräftig bedornt", 6], ["Männchen: große Innendornen etwa gleich groß; Weibchen: Halsschild länger als breit, Ränder höchstens gezähnelt", 8]],
  [["Vorderrandfeld der Deckflügel beim Männchen durchsichtig; Halsschildfläche des Weibchens gekörnt", "G:Ligariella"], ["Vorderrandfeld beim Männchen undurchsichtig; Halsschildfläche des Weibchens glatt", 7]],
  [["Vorderrand der Deckflügel beim Männchen weiß gesäumt; Vorderrandfeld mit parallelen Queräderchen", "G:Ligaria"], ["Vorderrand beim Männchen nicht weiß gesäumt; Vorderrandfeld unregelmäßig netzartig", "G:Ligariona"]],
  [["Kopf länger als breit", "G:Parentella"], ["Kopf breiter als lang", 9]],
  [["Stirnschild breiter; Vorderschenkel kräftiger, beim Weibchen mit gebogener Oberkante", "G:Metentella"], ["Stirnschild schmaler; Vorderschenkel schlanker, beim Weibchen mit fast gerader Oberkante", 10]],
  [["Vorderschiene außen mit 7 Dornen", "G:Entella"], ["Vorderschiene außen mit 8 Dornen", "G:Micrentella"]],
] };

// Dystactinae
FIX[13200] = { c: [
  [["Vorderschiene außen mit 7 Dornen", 2], ["Vorderschiene außen mit mehr als 7 Dornen", 3]],
  [["Seitenlappen der Halsschild-Verbreiterung gerundet; Fühler dick", "G:Gonypetella"], ["Seitenlappen der Halsschild-Verbreiterung spitz; Fühler dünn", "G:Telomantis"]],
  [["Scheitel über den Fühlern mit zwei Hörnchen", "G:Achlaena"], ["Scheitel über den Fühlern ohne Hörnchen", 4]],
  [["Scheitel in einen flachen, dreieckigen Lappen verlängert; Vorderschenkel außen mit 5 Dornen", "G:Amphecostephanus"], ["Scheitel gerundet", 5]],
  [["Vorderer Teil des Halsschilds glatt", 6], ["Vorderer Teil des Halsschilds mit 2 erhabenen Kielen vor der Querfurche", "G:Achlaenella"]],
  [["Halsschild kürzer als die Vorderhüften; hinterer Teil kaum länger als der vordere", "G:Dystactula"], ["Halsschild etwas länger als die Vorderhüften; hinterer Teil etwa doppelt so lang wie der vordere", "G:Dystacta"]],
] };
// Thespinae – Gruppen
FIX[14122] = { c: [
  [["Vorderschenkel mit 4 Scheibendornen", 2], ["Vorderschenkel mit 2–3 Scheibendornen", "GRP:Hoplocoryphae"]],
  [["Augen gerundet, nicht kegelförmig", "GRP:Thespes"], ["Augen nach vorn stumpf kegelförmig vorstehend", "GRP:Parathespes"]],
] };
// Gruppe Thespes
FIX[14141] = { c: [
  [["Vorderschiene außen mit 5 Dornen", 2], ["Vorderschiene außen mit 2–3 Dornen", "G:Galapagia"]],
  [["Vorderhüften länger als der hintere Teil des Halsschilds", 3], ["Vorderhüften höchstens so lang wie der hintere Teil des Halsschilds", 5]],
  [["Afterdeckplatte kürzer, von den Cerci überragt", 4], ["Afterdeckplatte länger, ragt über die Cerci hinaus", "G:Eumusonia"]],
  [["Hinterer Teil des Halsschilds glatt", "G:Musoniella"], ["Hinterer Teil des Halsschilds mit zwei Höckern", "G:Musoniola"]],
  [["Männchen: Deck- und Hinterflügel an der Spitze gerundet", 6], ["Männchen: Deck- und Hinterflügel an der Spitze spitz", "G:Leptomiopteryx"]],
  [["Klauenfurche in der Mitte des Vorderschenkels", 7], ["Klauenfurche vor der Mitte des Vorderschenkels", "G:Catamusonia"]],
  [["Vorderhüften so lang wie der hintere Teil des Halsschilds", "G:Musonia"], ["Vorderhüften kürzer als der hintere Teil des Halsschilds", 8]],
  [["Scheitellappen neben den Augen höher als der übrige Scheitel; Halsschild schlanker", "G:Paramusonia"], ["Scheitellappen neben den Augen nicht erhöht; Halsschild weniger schlank", "G:Thespis"]],
] };
// Schizocephalinae – Gruppen
FIX[15269] = { c: [
  [["Erster Scheibendorn des Vorderschenkels länger als der zweite", "GRP:Angelae"], ["Erster Scheibendorn kürzer als der zweite", 2]],
  [["Die beiden inneren Endlappen der Vorderhüfte liegen aneinander", "GRP:Euchomenellae"], ["Die beiden inneren Endlappen der Vorderhüfte spreizen auseinander", 3]],
  [["Augen kegelförmig verlängert, sehr spitz; Vorderschenkel mit 3 Scheibendornen", "GRP:Schizocephalae"], ["Augen gerundet; Vorderschenkel mit 4 Scheibendornen", "GRP:Truxomantes"]],
] };
// Gruppe Angelae
FIX[15863] = { c: [
  [["Cerci stark blattartig verbreitert", "G:Angela"], ["Cerci einfach, nicht verbreitert", "G:Thespoides"]],
] };

// Gruppe Miopteriges
FIX[13761] = { c: [
  [["Scheitel neben den Augen ohne Beulen; vorderer Teil des Halsschilds schlank", 2], ["Scheitel neben den Augen mit Beulen; vorderer Teil des Halsschilds breit, fast quadratisch", "G:Promiopteryx"]],
  [["Hinterflügel mit spitzer Spitze", "G:Eumiopteryx"], ["Hinterflügel mit gerundeter Spitze", 3]],
  [["Vorderrandfeld der Deckflügel vorn unregelmäßig netzartig geädert; Färbung grau", "G:Anamiopteryx"], ["Vorderrandfeld mit parallelen, weit stehenden Queräderchen; Färbung grün", "G:Chloromiopteryx"]],
] };
// Gruppe Truxomantes
FIX[15514] = { c: [
  [["Vorderschiene länger, etwa ein Drittel so lang wie der Vorderschenkel", 2], ["Vorderschiene sehr kurz, kaum ein Viertel so lang wie der Vorderschenkel", "G:Leptocola"]],
  [["Afterdeckplatte gerundet oder trapezförmig", 3], ["Afterdeckplatte dreieckig und spitz", "G:Agrionopsis"]],
  [["Hinterer Teil des Halsschilds mit Mittelkiel", 4], ["Hinterer Teil des Halsschilds ohne Mittelkiel", "G:Stenopyga"]],
  [["Mittel- und Hinterschenkel nahe der Spitze mit einem kleinen Läppchen", "G:Stenopygella"], ["Mittel- und Hinterschenkel einfach", "G:Agriomantis"]],
] };

// Pseudomiopteriginae
FIX[16239] = { c: [
  [["Halsschild kurz, rautenförmig", 2], ["Halsschild strichförmig, viel länger als breit", 5]],
  [["Fläche des Halsschilds glatt", 3], ["Fläche des Halsschilds mit Höckern", 4]],
  [["Vorderschiene außen mit 6–7 Dornen", "G:Diabantia"], ["Vorderschiene außen mit 3–4 Dornen", "G:Mantillica"]],
  [["Hinterbeine der Weibchen im Querschnitt rund", "G:Pseudomiopteryx"], ["Hinterbeine der Weibchen stark seitlich zusammengedrückt", "G:Anamiopteryx"]],
  [["Unterer Punktaugenhöcker spitz; Weibchen geflügelt", "G:Mantellias"], ["Unterer Punktaugenhöcker stumpf; Weibchen flügellos", 6]],
  [["Außendornen der Vorderschiene in gleichen Abständen", "G:Bantiella"], ["Der 7. Außendorn (von der Spitze) der Vorderschiene steht weiter ab", "G:Miobantia"]],
] };
// Oligonicinae – Gruppen
FIX[16669] = { c: [
  [["Mittelkiel des Halsschilds nicht erhaben", "GRP:Oligonices"], ["Mittelkiel des Halsschilds zu einem bedornten Grat erhoben", "GRP:Haaniae"]],
] };
// Gruppe Oligonices
FIX[16690] = { c: [
  [["Halsschild kurz, rautenförmig", "G:Bantia"], ["Halsschild viel länger als breit", 2]],
  [["Vorderschiene außen mit Randdornen (außer dem Enddorn)", 3], ["Vorderschiene außen ohne Randdornen, nur mit dem Enddorn", 5]],
  [["Halsschild nicht länger als die Vorderhüften", 4], ["Halsschild länger als die Vorderhüften", "G:Eumionyx"]],
  [["Stirnschild fast so hoch wie breit", "G:Eubantia"], ["Stirnschild breiter als hoch", "G:Mionicella"]],
  [["Vorderschenkel mit 4 Scheibendornen", 6], ["Vorderschenkel mit 3 Scheibendornen", 8]],
  [["Hinterer Teil des Halsschilds kürzer als die Vorderhüften", 7], ["Hinterer Teil des Halsschilds mindestens so lang wie die Vorderhüften", "G:Bactromantis"]],
  [["Afterdeckplatte länger, lanzettlich", "G:Oligonicella"], ["Afterdeckplatte kürzer, dreieckig", "G:Thrinaconyx"]],
  [["Scheitel über den Punktaugen mit einem Höcker", "G:Thesprotiella"], ["Scheitel ohne Höcker", 9]],
  [["Vorderschiene innen mit einigen Randdornen außer dem Enddorn und den Rückendornen", "G:Oligonyx"], ["Vorderschiene innen ohne Randdornen, nur mit Rückendornen und Enddorn", "G:Thesprotia|G:Pogonogaster|G:Carrikerella"]],
] };
// Gruppe Oxypili
FIX[17638] = { c: [
  [["Halsschild kürzer als die Vorderhüften", 2], ["Halsschild so lang wie die Vorderhüften", "G:Pseudoxypilus"]],
  [["Vorderer Teil des Halsschilds mit 4 kegelförmigen Höckern (Arten aus Afrika)", 3], ["Vorderer Teil des Halsschilds mit 2 kegelförmigen Höckern (Arten aus Asien)", 6]],
  [["Hinterschenkel glatt", 4], ["Hinterschenkel unten mit drei Zähnen", "G:Junodia"]],
  [["Vorderschenkel außen mit 4 Dornen", 5], ["Vorderschenkel außen mit 5 Dornen", "G:Anoxypilus"]],
  [["Außendornen des Vorderschenkels etwa gleich lang", "G:Oxypilus"], ["Außendornen ungleich lang, die beiden letzten zur Spitze hin kleiner", "G:Euoxypilus"]],
  [["Hinterer Teil des Halsschilds mit 4 Höckern", "G:Pachymantis"], ["Hinterer Teil des Halsschilds mit 2 Höckern", "G:Ceratomantis"]],
] };
// Liturgusinae – Gruppen
FIX[18328] = { c: [
  [["Afterdeckplatte groß, bedeckt das Hinterleibsende", "GRP:Liturgusae"], ["Afterdeckplatte klein, quer", 2]],
  [["Scheitel neben den Augen mit Höckern", "GRP:Dactylopteriges"], ["Scheitel ohne Höcker", "GRP:Gonatistellae"]],
] };
// Sibyllinae – Gruppen
FIX[18830] = { c: [
  [["Scheitel ohne Fortsatz", "GRP:Arriae"], ["Scheitel mit einem schlanken Fortsatz", "GRP:Sibyllae"]],
] };
// Caliridinae – Gruppen
FIX[19082] = { c: [
  [["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 2], ["Die inneren Endlappen der Vorderhüfte liegen aneinander", "GRP:Deromantes"]],
  [["Erster Scheibendorn hinter dem zweiten", "GRP:Calirides"], ["Erster Scheibendorn innen neben dem zweiten", "GRP:Leptomantes"]],
] };
// Mellierinae – Gruppen
FIX[19616] = { c: [
  [["Die inneren Endlappen der Vorderhüfte spreizen auseinander", "GRP:Mellierae"], ["Die inneren Endlappen der Vorderhüfte liegen aneinander", "GRP:Mellierellae"]],
] };

// Photininae – Gruppen
FIX[19756] = { c: [
  [["Mittelschenkel länger als die Vorderhüften", 2], ["Mittelschenkel höchstens so lang wie die Vorderhüften", 3]],
  [["Vorderschenkel mit 3 Scheibendornen", "GRP:Coptopteriges"], ["Vorderschenkel mit 4 Scheibendornen", "GRP:Photinae"]],
  [["Stirnschild sehr schmal, nicht gekörnt", "GRP:Orthoderellae"], ["Stirnschild breiter, mit zwei Körnchen", "GRP:Irides"]],
] };
// Gruppe Photinae
FIX[20207] = { c: [
  [["Die inneren Endlappen der Vorderhüfte liegen aneinander", "G:Macromantis"], ["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 2]],
  [["Vorderschenkel außen mit 6 Randdornen", "G:Metriomantis"], ["Vorderschenkel außen mit 5 Randdornen", 3]],
  [["Vorderrandfeld der Deckflügel beim Männchen ganz glasklar, mit einfachen, parallelen, weit stehenden Adern; beim Weibchen mit sehr vielen parallelen Adern", 4], ["Vorderrandfeld beim Männchen fast undurchsichtig, die parallelen Adern unregelmäßig verzweigt; beim Weibchen unregelmäßig netzartig", "G:Photinella"]],
  [["Stirnschild nur 2- bis 2½-mal so breit wie hoch", "G:Photina"], ["Stirnschild sehr niedrig, mindestens 4-mal so breit wie hoch", "G:Hicetia"]],
] };
// Gruppe Deroplates
FIX[21105] = { c: [
  [["Augen gerundet", "G:Deroplatys"], ["Augen spitz", "G:Brancsikia"]],
] };
// Mantinae – Gruppen (Paar 7 hat drei Möglichkeiten)
FIX[21524] = { c: [
  [["Außenkante des Vorderschenkels zwischen den Dornen gekerbt", 2], ["Außenkante des Vorderschenkels glatt", 7]],
  [["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 3], ["Die inneren Endlappen der Vorderhüfte liegen aneinander", "GRP:Trachymantes"]],
  [["Mittel- und Hinterschenkel ohne oder nur mit sehr kleinen Lappen", 4], ["Mittel- und Hinterschenkel unten mit großen und oben mit kleineren Lappen", "GRP:Phyllomantes"]],
  [["Vorderschiene mit 6–7 Dornen", 5], ["Vorderschiene mit mehr als 7 Dornen", 6]],
  [["Erstes Fußglied der Hinterbeine kürzer als die übrigen Glieder zusammen", "GRP:Parasphendales"], ["Erstes Fußglied der Hinterbeine mindestens so lang wie die übrigen zusammen", "GRP:Cilniae"]],
  [["Afterdeckplatte quer, gerundet", "GRP:Sphodropodae"], ["Afterdeckplatte dreieckig, spitz", "GRP:Miomantes"]],
  [["Hinterflügel: Diskoidalader bei Männchen und Weibchen einfach oder nur gegabelt", 8], ["Hinterflügel: Diskoidalader beim Weibchen einfach oder gegabelt, beim Männchen zweiästig", 9], ["Hinterflügel: Diskoidalader bei beiden Geschlechtern mindestens zweiästig", 11]],
  [["Hautsaum (Analfeld) der Deckflügel glasklar oder nur leicht grau", "GRP:Stagmomantes"], ["Hautsaum (Analfeld) der Deckflügel schwarz", "GRP:Phasmomantes"]],
  [["Stirnschild mit zwei Körnchen", "GRP:Bisanthes"], ["Stirnschild ohne Körnchen", 10]],
  [["Hautsaum (Analfeld) der Deckflügel glasklar oder nur leicht grau", "GRP:Stagmomantes"], ["Hautsaum (Analfeld) der Deckflügel schwarz", "GRP:Phasmomantes"]],
  [["Hinterflügel im Mittel- oder Vorderrandfeld mit schwarzen oder roten Querbinden", "GRP:Polyspilotae"], ["Hinterflügel ohne Querbinden", 12]],
  [["Mittel- und Hinterschenkel ohne Enddorn", 13], ["Mittel- und Hinterschenkel mit einem Enddorn an der Spitze", 14]],
  [["Augen gerundet", "GRP:Mantes"], ["Augen etwas kegelförmig", "G:Mesopteryx"]],
  [["Stirnschild quer, mindestens doppelt so breit wie hoch", "GRP:Tenoderae"], ["Stirnschild nicht quer: höher als breit oder kaum breiter als hoch", "GRP:Hierodulae"]],
] };
// Gruppe Stagmomantes
FIX[23280] = { c: [
  [["Die inneren Endlappen der Vorderhüfte liegen aneinander", 2], ["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 5]],
  [["Stirnschild fast so hoch wie breit, nahe dem Oberrand mit zwei Kielen", "G:Isomantis"], ["Stirnschild quer", 3]],
  [["Dornen der Vorderhüften sehr dick, wie dreieckige Zähne", "G:Stauromantis"], ["Dornen der Vorderhüften schlanker", 4]],
  [["Vorderrandfeld der Deckflügel beim Männchen glasklar; beim Weibchen schmal, kaum ein Drittel so breit wie das Mittelfeld", "G:Stagmomantis"], ["Vorderrandfeld beim Männchen undurchsichtig; beim Weibchen breiter", "G:Auromantis"]],
  [["Vorderrandfeld der Deckflügel beim Männchen durchsichtig; Deckflügel der Weibchen erreichen nicht das Ende des 2. Hinterleibssegments", "G:Oromantis"], ["Vorderrandfeld beim Männchen undurchsichtig; Deckflügel der Weibchen länger", "G:Uromantis"]],
] };
// Gruppe Polyspilotae
FIX[24155] = { c: [
  [["Hinterer Teil des Halsschilds mindestens so lang wie die Vorderhüften", 2], ["Hinterer Teil des Halsschilds kürzer als die Vorderhüften", "G:Prohierodula"]],
  [["Hinterflügel: Spitze des Mittelfelds mit sehr vielen, dicht stehenden, S-förmig geschwungenen Queräderchen", "G:Polyspilota"], ["Spitze des Mittelfelds ohne solche dichten S-Äderchen", 3]],
  [["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 4], ["Die inneren Endlappen der Vorderhüfte liegen aneinander", "G:Plistospilota"]],
  [["Vorderrandfeld der Deckflügel mit parallelen Queräderchen", "G:Calospilota"], ["Vorderrandfeld der Deckflügel mit unregelmäßigen, vieleckigen Maschen", "G:Cataspilota"]],
] };
// Gruppe Tenoderae
FIX[25223] = { c: [
  [["Stirnschild weniger schmal; Augen seitlich gerundet", 2], ["Stirnschild sehr schmal; Augen seitlich etwas kegelförmig", "G:Mesopteryx"]],
  [["Vorderrand der Deckflügel glatt", "G:Tenodera"], ["Vorderrand der Deckflügel gekerbt", "G:Epitenodera"]],
] };
// Archimantinae
FIX[28375] = { c: [
  [["Cerci walzenförmig (rund)", "GRP:Pseudomantes"], ["Cerci bandartig flach", "GRP:Archimantes"]],
] };
FIX[28391] = { c: [
  [["Vorderhüften ohne Außenlappen", 2], ["Vorderhüften am Außenrand mit breiten Lappen", "G:Rheomantis"]],
  [["Cerci lang, über das Hinterleibsende hinausragend", "G:Archimantis"], ["Cerci kurz, nicht über das Hinterleibsende hinausragend", "G:Coenomantis"]],
] };
FIX[28623] = { c: [
  [["Afterdeckplatte gerundet", "G:Pseudomantis"], ["Afterdeckplatte dreieckig", "G:Rhodomantis|G:Austromantis"]],
] };
// Eufischeriellinae – Gruppen
FIX[28850] = { c: [
  [["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 2], ["Die inneren Endlappen der Vorderhüfte liegen aneinander", 4]],
  [["Vorderschenkel außen mit 4 Dornen", 3], ["Vorderschenkel außen mit 5 Dornen", "GRP:Ischnomantes"]],
  [["Spitzenlappen der Hinterflügel kurz; Deck- und Hinterflügel der Weibchen an der Spitze gerundet", "GRP:Eufischeriellae"], ["Spitzenlappen der Hinterflügel lang; Deck- und Hinterflügel der Weibchen sehr spitz", "GRP:Euchomenae"]],
  [["Vorderschenkel mit 2–3 Scheibendornen", "GRP:Omomantes"], ["Vorderschenkel mit 4 Scheibendornen", "GRP:Pseudempusae"]],
] };
// Acontistinae – Gruppen
FIX[30193] = { c: [
  [["Scheitel ohne Fortsatz; Mittel- und Hinterschenkel ohne Lappen", "GRP:Acontistae"], ["Scheitel mit kegelförmigem Fortsatz; Mittel- und Hinterschenkel mit Lappen", "GRP:Callibiae"]],
] };
// Epaphroditinae – Gruppen
FIX[30776] = { c: [
  [["Vorderschenkel außen mit 4 Dornen", "GRP:Parablephares"], ["Vorderschenkel außen mit 5–7 Dornen", 2]],
  [["Mittel- und Hinterschienen ohne Lappen", "GRP:Epaphroditae"], ["Mittel- und Hinterschienen mit Lappen", "GRP:Phyllocraniae"]],
] };
// Gruppen ohne eigene Überschrift im Textauszug oder mit nur einer Gattung
const ALIAS = {
  Orthoderae: "G:Orthodera|G:Orthoderina", Tarachodes: "SYN:6219", Pyrgomantes: "G:Pyrgomantis", Euoxyophthalmi: "SYN:8549", Dysaules: "SYN:8459", Episcopi: "SYN:8127",
  Chroicopterae: "SYN:12239", Nanomantes: "SYN:10356", Truxomantes: "SYN:15514", Angelae: "SYN:15863", Irides: "G:Iris",
  Stagmomantes: "SYN:23280", Phasmomantes: "SYN:23940", Polyspilotae: "SYN:24155", Bisanthes: "G:Bisanthe", Miomantes: "G:Miomantis", Cilniae: "SYN:21993",
  Phyllomantes: "G:Phyllomantis", Parasphendales: "G:Parasphendale", Sphodropodae: "G:Sphodropoda", Trachymantes: "G:Trachymantis", Mantes: "SYN:24840", Tenoderae: "SYN:25223", Hierodulae: "SYN:25723",
  Pseudempusae: "SYN:29979", Ischnomantes: "G:Ischnomantis", Euchomenae: "G:Euchomena", Omomantes: "G:Omomantis", Parablephares: "G:Parablepharis", Phyllocraniae: "G:Phyllocrania",
  Callibiae: "G:Callibia", Gonatistellae: "G:Gonatistella", Deromantes: "G:Deromantis", Leptomantes: "G:Leptomantis|G:Aetaella", Mellierae: "G:Melliera", Mellierellae: "G:Mellierella",
  Parathespes: "G:Parathespis", Hoplocoryphae: "SYN:14734", Metallytici: "G:Metallyticus", Mantoidae: "SYN:4362", Eremiaphilae: "SYN:4561", Euchomenellae: "G:Euchomenella",
  Arriae: "G:Arria", Sibyllae: "SYN:18898", Liturgusae: "SYN:18346", Dactylopteriges: "SYN:18702", Calirides: "SYN:19097", Coptopteriges: "SYN:19778", Photinae: "SYN:20207", Orthoderellae: "SYN:20636",
  Haaniae: "SYN:17500", Oligonices: "SYN:16690", Tarachinae: "G:Tarachina", Stenomantes: "SYN:10793", Tropidomantes: "SYN:9667", Iridopteriges: "SYN:8970", Humbertiellae: "SYN:5512", Paraoxypili: "SYN:2614", Perlamantes: "SYN:3155", Compsothespes: "SYN:3996", Sphaeromantes: "G:Sphaeromantis",
  Ameles: "SYN:10963", Gonypetae: "SYN:11515", Thespes: "SYN:14141", Schizocephalae: "G:Schizocephala", Oxypili: "SYN:17638", Oxyothespes: "SYN:18067", Majangae: "SYN:19451", Deroplates: "SYN:21105", Archimantes: "SYN:28391", Pseudomantes: "SYN:28623", Solygiae: "G:Solygia",
  Eufischeriellae: "SYN:28878", Acontistae: "SYN:30206", Epaphroditae: "SYN:30788", Miopteriges: "SYN:13761",
};

// Gruppe Tarachodes
FIX[6219] = { c: [
  [["Vorderhüften ragen über den Hinterrand des Halsschilds hinaus", 2], ["Vorderhüften erreichen den Hinterrand des Halsschilds nicht", 7]],
  [["Augen kegelförmig", "G:Charieis"], ["Augen gerundet", 3]],
  [["Vorderschiene außen mit 8–9 Dornen", 4], ["Vorderschiene außen mit mehr als 9 Dornen", 5]],
  [["Afterdeckplatte groß, fast so lang wie breit, am Ende breit gerundet", "G:Antistia"], ["Afterdeckplatte kurz, quer", "G:Ariusia"]],
  [["Erstes Fußglied der Vorderbeine und Cerci walzenförmig", "G:Tarachodella"], ["Erstes Fußglied der Vorderbeine und Cerci flachgedrückt", 6]],
  [["Mittel- und Hinterschenkel im Querschnitt rund", "G:Tarachodula"], ["Mittel- und Hinterschenkel flachgedrückt", "G:Tarachodes"]],
  [["Scheitel gewölbt oder gerade, nicht ausgehöhlt; Augen ragen nicht über den Scheitel", 8], ["Scheitel ausgehöhlt; Augen ragen über den Scheitel hinaus", "G:Oxyophthalmellus"]],
  [["Deckflügel der Männchen so lang wie der Hinterleib oder etwas kürzer; Halsschild der Weibchen ohne Beulen", "G:Galepsus"], ["Deckflügel der Männchen kurz, kaum über die Hinterleibsmitte; Halsschild der Weibchen hinter der Querfurche mit 2 stumpfen Beulen", "G:Paralygdamia"]],
] };
// Gruppe Eufischeriellae
FIX[28878] = { c: [
  [["Augen gerundet", 2], ["Augen seitlich kegelförmig", "G:Deiphobella"]],
  [["Afterdeckplatte ragt nicht über das Hinterleibsende; keine Dornen an den Hüftgelenken", 3], ["Afterdeckplatte sehr lang, lanzettlich, über das Hinterleibsende ragend; 2–3 Dornen an den Hüftgelenken", "G:Eremoplana"]],
  [["Hinterhaupt neben jedem Auge mit einem Höcker", "G:Geomantis"], ["Hinterhaupt ohne Höcker", 4]],
  [["Cerci flachgedrückt", "G:Severinia"], ["Cerci walzen- oder kegelförmig", 5]],
  [["Weibchen: 2. und 3. Hinterleibssegment in der Mitte des Hinterrands mit einem kleinen Lappen", 6], ["Weibchen: Hinterleibssegmente ohne Lappen", 7]],
  [["Scheitel beiderseits der Mitte mit einer kleinen kegelförmigen Beule", "G:Carvilia"], ["Scheitel ohne Beulen", "G:Geothespis"]],
  [["Afterdeckplatte quer, am Ende gerundet", "G:Bolivaria"], ["Afterdeckplatte dreieckig, spitz, mehr oder weniger lang", 8]],
  [["Vorderschiene innen mit 9–10 Dornen", 9], ["Vorderschiene innen mit mehr als 10 Dornen", 10]],
  [["Deckflügel der Männchen sehr kurz", "G:Teddia"], ["Deckflügel der Männchen lang, über den Hinterleib hinausragend", "G:Microthespis"]],
  [["Klauenfurche hinter der Mitte des Vorderschenkels; Unterseite des Hinterleibsendes beim Weibchen mit 2 Dornen", "G:Eufischeriella"], ["Klauenfurche in der Mitte des Vorderschenkels; Hinterleibsende des Weibchens unten ohne Dornen", "G:Deiphobe"]],
] };
// Acromantinae – Gruppen
FIX[31340] = { c: [
  [["Mittel- und Hinterschenkel ohne Lappen", "GRP:Anaxarchae"], ["Mittel- und Hinterschenkel mit Lappen", 2]],
  [["Augen gerundet", 3], ["Augen spitz", "GRP:Galinthiades"]],
  [["Scheitel ohne Fortsatz", 4], ["Scheitel in einen mehr oder weniger langen Fortsatz verlängert", "GRP:Phyllothelides"]],
  [["Fläche des Halsschilds gekörnt oder rau", "GRP:Ambiviae"], ["Fläche des Halsschilds glatt", "GRP:Acromantes"]],
] };
// Gruppe Acromantes
FIX[31410] = { c: [
  [["Die inneren Endlappen der Vorderhüfte liegen aneinander", 2], ["Die inneren Endlappen der Vorderhüfte spreizen auseinander", 5]],
  [["Deckflügel zwischen den schrägen Längsadern dicht und fein netzartig", 3], ["Deckflügel zwischen den Längsadern mit einer Doppelreihe von Zellen", 4]],
  [["Scheitel über den Punktaugen ohne Höcker", "G:Heliomantis"], ["Scheitel über den Punktaugen mit kegelförmigem Höcker", "G:Psychomantis"]],
  [["Scheitel über den Punktaugen mit kegelförmigem Höcker", "G:Rhomantis"], ["Scheitel ohne Höcker", "G:Oligomantis"]],
  [["Scheitel über den Punktaugen ohne oder mit sehr kleinem Höcker; Hinterflügel an der Spitze abgestutzt, nicht sichelförmig; Vorderschenkel oben ohne Lappen", "G:Acromantis"], ["Scheitel über den Punktaugen mit kegelförmigem Höcker; Hinterflügel an der Spitze sichelförmig gebogen; Vorderschenkel oben mit zahnförmigem Lappen", "G:Citharomantis"]],
] };
// Hymenopodinae – Gruppen
FIX[32462] = { c: [
  [["Vorderschenkel stark verbreitert, Oberkante stark gebogen", 2], ["Vorderschenkel nicht stark verbreitert, Oberkante gerade oder schwach gebogen", 3]],
  [["Mittel- und Hinterschenkel ohne Lappen", "GRP:Hestiasulae"], ["Mittel- und Hinterschenkel mit Lappen", "GRP:Otomantes"]],
  [["Halsschild kleeblattförmig: die Seitenlappen stark verbreitert", "GRP:Pseudocreobotrae"], ["Halsschild länglich-eiförmig oder wenig verbreitert, nicht kleeblattförmig", 4]],
  [["Augen kegelförmig", "GRP:Hymenopoda"], ["Augen gerundet", 5]],
  [["Stirnschild quer, oben in ein kleines Zähnchen auslaufend", "GRP:Euantissae"], ["Stirnschild kaum breiter als hoch, am Oberrand mit zwei kleinen seitlichen Zähnchen", "GRP:Panurgicae"]],
] };
FIX[32488] = { c: [
  [["Oberrand des Stirnschilds gebogen", "G:Euantissa"], ["Oberrand des Stirnschilds in eine Spitze auslaufend", 2]],
  [["Seitenränder des Halsschilds fast parallel, Halsschild zur Basis wenig verschmälert", "G:Odontomantis"], ["Seitenränder des Halsschilds gebogen, Halsschild zur Basis stark verschmälert", "G:Nemotha"]],
] };
FIX[33220] = { c: [
  [["Mittel- und Hinterschenkel mit einem Lappen über die ganze Länge (wie Blütenblätter)", "G:Hymenopus"], ["Mittel- und Hinterschenkel nur nahe der Spitze mit Lappen", 2]],
  [["Punktaugenhöcker stumpf", 3], ["Punktaugenhöcker spitz", "G:Pseudoharpax"]],
  [["Stirnschild mit drei Kielen", "G:Parhymenopus"], ["Stirnschild mit zwei Kielen", 4]],
  [["Augen ohne Höcker", "G:Creobroter"], ["Augen mit einem Höcker", "G:Helvia"]],
] };
// Toxoderinae – Gruppen
FIX[33918] = { c: [
  [["Vorderschienen schlank", 2], ["Vorderschienen flachgedrückt und stark verbreitert", "GRP:Stenophyllae"]],
  [["Vorderhüften an der Spitze zu einem Lappen verbreitert", "GRP:Paradanuriae"], ["Vorderhüften an der Spitze nicht verbreitert", 3]],
  [["Augen oben mit einem Dorn", "GRP:Toxoderae"], ["Augen ohne Dorn", 4]],
  [["Scheitel in der Mitte ohne Dornen", "GRP:Loxomantes"], ["Scheitel in der Mitte mit 2 Dornen", "GRP:Calamothespes"]],
] };
FIX[34410] = { c: [
  [["Vorderschenkel außen mit 7 Dornen", 2], ["Vorderschenkel außen mit 5 Dornen; Cerci lang, am Ende zweispitzig", "G:Dorymantis"]],
  [["Cerci lang, am Ende eingekerbt; seitliche Knielappen der Mittelschenkel lang und dornförmig", "G:Belomantis"], ["Cerci kurz und breit, am Ende breit gerundet; seitliche Knielappen kurz, dreieckig", "G:Calamothespis"]],
] };
// Vatinae – Gruppen
FIX[34574] = { c: [
  [["Spitze der Vorderhüften nicht schaufelartig verbreitert", 2], ["Spitze der Vorderhüften schaufelartig verbreitert (Alte Welt)", 7]],
  [["Vorderschenkel mit 3 Scheibendornen", "GRP:Cardiopterae"], ["Vorderschenkel mit 4 Scheibendornen", 3]],
  [["Scheitel ohne langen Fortsatz", 4], ["Scheitel in einen langen Fortsatz verlängert", "GRP:Ceratocraniae"]],
  [["Cerci walzenförmig (Amerika)", 5], ["Cerci flach, blattartig (Alte Welt)", "GRP:Heterochaetae"]],
  [["Seitliche Punktaugenhöcker nicht verlängert", 6], ["Seitliche Punktaugenhöcker in zwei kegelförmige oder blattartige Fortsätze verlängert", "GRP:Vates"]],
  [["Augen seitlich mehr oder weniger kegelförmig", "GRP:Oxyopsides"], ["Augen gerundet", "GRP:Stagmatopterae"]],
  [["Vorderschenkel mit 3 Scheibendornen; Cerci flach, blattartig (Asien)", "GRP:Aethalochroae"], ["Vorderschenkel mit 4 Scheibendornen; Cerci walzenförmig (Afrika)", 8]],
  [["Vorderschenkel vor der Spitze oben ohne Lappen", "GRP:Danuriae"], ["Vorderschenkel vor der Spitze oben mit einem dreieckigen Lappen", "GRP:Popae"]],
] };
FIX[35197] = { c: [
  [["Halsschild über den Hüften ohne Höcker", 2], ["Halsschild auf der Verbreiterung über den Hüften mit Höckern", "G:Heterovates"]],
  [["Mittel- und Hinterschenkel ohne Lappen", 3], ["Mittel- und Hinterschenkel mit Lappen", 6]],
  [["Stirnschild quer und schmal", 4], ["Stirnschild kaum breiter als hoch", "G:Stagmatoptera"]],
  [["Halsschild nicht doppelt so lang wie die Vorderhüften", 5], ["Halsschild fast doppelt so lang wie die Vorderhüften", "G:Leptochoche"]],
  [["Vorderrandfeld der Deckflügel bei beiden Geschlechtern undurchsichtig", "G:Parastagmatoptera"], ["Vorderrandfeld der Deckflügel beim Männchen durchsichtig", "G:Ardesca"]],
  [["Vorderhüften reichen bis zur Basis der Vorderbrust; Deckflügel der Weibchen: Vorderrandfeld schmaler als das Mittelfeld", "G:Lobocneme"], ["Vorderhüften erreichen die Basis der Vorderbrust nicht; Vorderrandfeld breiter als das Mittelfeld", "G:Chopardiella"]],
] };
FIX[35968] = { c: [
  [["Vorderschenkel oben vor der Spitze ohne Lappen", 2], ["Vorderschenkel oben vor der Spitze mit einem Lappen", "G:Zoolea"]],
  [["Mittel- und Hinterbeine ohne Lappen", 3], ["Mittel- und Hinterbeine mit Lappen", 4]],
  [["4. Hinterleibssegment ohne Seitenlappen; Halsschild länger", "G:Phyllovates"], ["4. Hinterleibssegment seitlich zu einem Lappen verbreitert; Halsschild kürzer", "G:Hagiotata"]],
  [["Deckflügel der Weibchen mit bräunlichen Querbinden, Vorderrandfeld vor der Spitze plötzlich verschmälert; Fühler der Männchen perlschnurartig", "G:Pseudovates"], ["Deckflügel der Weibchen einfarbig, Vorderrandfeld allmählich verschmälert; Fühler der Männchen gekämmt", "G:Vates"]],
] };
FIX[36758] = { c: [
  [["Augen ohne Dorn", "G:Stenovates"], ["Augen mit einem Dorn", "G:Heterochaeta"]],
] };
// Empusinae – Gruppen
FIX[37708] = { c: [
  [["Hinterer innerer Endlappen der Vorderhüfte in eine scharfe Spitze ausgezogen", "GRP:Empusae"], ["Dieser Lappen nicht spitz ausgezogen", 2]],
  [["Vorderhüften nicht blattartig verbreitert", "GRP:Blepharodes"], ["Vorderhüften zu einem breiten Blattlappen verbreitert", "GRP:Idola"]],
] };
// Gruppe Hierodulae (Textzuordnung von Hand korrigiert)
FIX[25723] = { c: [
  [["Zwischen Fühleransatz und Innenrand des Auges ein kleiner kegelförmiger Höcker", 2], ["Zwischen Fühleransatz und Auge kein Höcker", 4]],
  [["Vorderrand der Deckflügel glatt", 3], ["Vorderrand der Deckflügel fein gekerbt", "G:Sphodromantis"]],
  [["Mittelfeld der Deckflügel mindestens in der vorderen Hälfte undurchsichtig", "G:Alalomantis"], ["Mittelfeld der Deckflügel ganz glasklar", "G:Tarachomantis"]],
  [["Klauenfurche hinter der Mitte des Vorderschenkels", 5], ["Klauenfurche fast in der Mitte des Vorderschenkels", 9]],
  [["Vorderrandfeld der Deckflügel mit weiten, vieleckigen Maschen", 6], ["Vorderrandfeld der Deckflügel sehr dicht und kleinmaschig genetzt", 7]],
  [["Hinterer Teil des Halsschilds ohne seitliche Verbreiterungen", "G:Hierodulella"], ["Hinterer Teil des Halsschilds beiderseits mit einer Verbreiterung", "G:Pnigomantis"]],
  [["Vorderhüften der Weibchen ohne Zähne", "G:Ephierodula"], ["Vorderhüften der Weibchen gezähnt", 8]],
  [["Vorderrand der Deckflügel glatt", "G:Hierodula"], ["Vorderrand der Deckflügel fein gekerbt", "G:Parhierodula"]],
  [["Endlappen der Mittel- und Hinterschenkel gerundet", "G:Camelomantis"], ["Endlappen der Mittel- und Hinterschenkel sehr spitz", "G:Tisma"]],
] };

// Gruppe Oxyothespes
FIX[18067] = { c: [
  [["Halsschild weniger als doppelt so lang wie die Vorderhüften", 2], ["Halsschild mehr als doppelt so lang wie die Vorderhüften", "G:Acithespis"]],
  [["Außendornen des Vorderschenkels etwa gleich lang", "G:Oxyothespis"], ["2. Außendorn des Vorderschenkels länger als die übrigen", "G:Heterochaetula"]],
] };
// Gruppe Empusae
FIX[37732] = { c: [
  [["Vorderschenkel oben zu einem großen Blattlappen verbreitert; Mittel- und Hinterschenkel oben mit Lappen", "G:Gongylus"], ["Vorderschenkel wenig verbreitert, Oberkante gerade oder fast gerade; Mittel- und Hinterschenkel oben ohne Lappen", 2]],
  [["Mittel- und Hinterschenkel mit Lappen", 3], ["Mittel- und Hinterschenkel ohne Lappen", 4]],
  [["Knie-Dorn der Mittel- und Hinterschenkel kurz", "G:Empusa"], ["Knie-Dorn der Mittel- und Hinterschenkel lang", "G:Hemiempusa"]],
  [["Häutiger Endteil des Scheitelfortsatzes etwa so lang wie oder kürzer als der Basisteil", "G:Idolomorpha"], ["Häutiger Endteil des Scheitelfortsatzes etwa so lang wie oder länger als der Basisteil", "G:Hypsicorypha"]],
] };

// Perlamantinae – Gruppen
FIX[2584] = { c: [
  [["Halsschild kurz, breiter als lang oder kaum länger als breit", 2], ["Halsschild viel länger als breit, schlank, manchmal stabförmig; Vorderschenkel mit 2–3 Scheibendornen; Vorderschienen schlank", "GRP:Compsothespes"]],
  [["Vorderschenkel mit 2–3 Scheibendornen", 3], ["Vorderschenkel mit nur 1 Scheibendorn; Afterdeckplatte kurz, quer; Vorderschienen schlank, an der Spitze unbewehrt", "GRP:Perlamantes"]],
  [["Afterdeckplatte der Weibchen groß, mit Kiel", "GRP:Paraoxypili"], ["Afterdeckplatte der Weibchen klein, quer", "GRP:Sphaeromantes"]],
] };

Object.assign(ALIAS, {
  Anaxarchae: "G:Anaxarcha", Galinthiades: "G:Galinthias", Phyllothelides: "SYN:31965", Ambiviae: "SYN:31861", Acromantes: "SYN:31410",
  Hestiasulae: "SYN:32658", Otomantes: "SYN:32907", Pseudocreobotrae: "SYN:33627", Hymenopoda: "SYN:33220", Euantissae: "SYN:32488", Panurgicae: "SYN:33049",
  Stenophyllae: "G:Stenophylla", Paradanuriae: "SYN:33941", Toxoderae: "SYN:34138", Loxomantes: "G:Loxomantis", Calamothespes: "SYN:34410",
  Cardiopterae: "G:Cardioptera", Ceratocraniae: "G:Ceratocrania", Aethalochroae: "G:Aethalochroa", Heterochaetae: "SYN:36758", Vates: "SYN:35968", Oxyopsides: "SYN:34661", Stagmatopterae: "SYN:35197", Danuriae: "SYN:37099", Popae: "SYN:37517",
  Empusae: "SYN:37732", Blepharodes: "SYN:38355", Idola: "G:Idolum",
});

module.exports = { FIX, ALIAS };
