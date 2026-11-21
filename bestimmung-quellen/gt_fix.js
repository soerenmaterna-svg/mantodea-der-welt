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

// ===== Artschlüssel (von Hand korrigiert und übertragen)
FIX[37866] = { gen: "Empusa", c: [
  [["Deckflügel an beiden Enden des Flügelmals mit je einem braunen oder rosa Fleck", 2], ["Deckflügel ohne diese Flecken", 4]],
  [["Mittel- und Hinterhüften mit einem gerundeten Lappen", 3], ["Mittel- und Hinterhüften ohne gerundeten Lappen", "A:fronticornis"]],
  [["Kleiner; Halsschildränder schwächer bedornt", "A:guttula"], ["Größer; Dornen am Halsschildrand kräftiger", "A:spinosa"]],
  [["Mittel- und Hinterschenkel mit Lappen", 5], ["Mittel- und Hinterschenkel ohne Lappen", "A:pectinata"]],
  [["Mittel- und Hinterhüften mit einem gerundeten Lappen", 6], ["Mittel- und Hinterhüften ohne oder mit undeutlichem Lappen", 8]],
  [["Hinterer Halsschildteil einfarbig", 7], ["Hinterer Halsschildteil mit 2 grünen Längslinien", "A:simonyi"]],
  [["Ränder des hinteren Halsschildteils kaum oder nicht gezähnelt", "A:fasciata"], ["Ränder des hinteren Halsschildteils mit langen, weit stehenden Dornen", "A:aegyptiaca"]],
  [["Längsadern der Hinterflügel an ihrem Ende bräunlich gesäumt", "A:pennata"], ["Längsadern der Hinterflügel nicht bräunlich gesäumt", 9]],
  [["Halsschild kaum länger als die halbe Deckflügellänge", "A:pennicornis"], ["Halsschild kaum kürzer als die Deckflügel", 10]],
  [["Ränder des hinteren Halsschildteils auch beim Männchen kräftig gezähnelt", "A:pauperata"], ["Ränder des hinteren Halsschildteils auch beim Weibchen fast unbewehrt", "A:hedenborgii"]],
] };
FIX[25120] = { gen: "Statilia", c: [
  [["Vorderbrust hinter den Hüften mit schwarzer Binde", "A:maculata"], ["Vorderbrust ohne Binde hinter den Hüften", 2]],
  [["Vorderbrust einfarbig", "A:nemoralis"], ["Vorderbrust vor dem Hinterrand breit schwärzlich", "A:apicalis"]],
] };
FIX[18936] = { gen: "Sibylla", c: [
  [["Dornen der Vorderhüften schwarz", 2], ["Dornen der Vorderhüften gelbbraun", 5]],
  [["Knie-Dornen der Mittel- und Hinterschenkel gelb", 3], ["Knie-Dornen der Mittel- und Hinterschenkel schwarz", "A:limbata"]],
  [["Seitenlappen des Scheitelfortsatzes nicht länger als breit", 4], ["Seitenlappen des Scheitelfortsatzes viel länger als breit", "A:dives"]],
  [["Halsschild schlanker und länger; Vorderhüften reichen bis etwa 2/3 des hinteren Halsschildteils", "A:pretiosa"], ["Halsschild weniger schlank und kürzer; Vorderhüften reichen über 2/3 des hinteren Halsschildteils hinaus", "A:gratiosa"]],
  [["Halsschild weniger als doppelt so lang wie die Vorderhüften", "A:griffinii"], ["Halsschild doppelt so lang wie die Vorderhüften", "A:pannulata"]],
] };
FIX[21132] = { gen: "Deroplatys", c: [
  [["Dornen der Vorderhüften an der Basis nicht schwarz gezeichnet", 2], ["Dornen der Vorderhüften an der Basis beiderseits schwarz gezeichnet oder schwarz umrandet", 4]],
  [["Augen gerundet", 3], ["Augen seitlich etwas kegelförmig", "A:truncata"]],
  [["Halsschild-Verbreiterung nicht glockenförmig", "A:desiccata"], ["Halsschild-Verbreiterung glockenförmig", "A:shelfordi"]],
  [["Hinterecken der Halsschild-Verbreiterung beim Weibchen gezähnt, beim Männchen kaum gekerbt", 5], ["Hinterecken der Verbreiterung bei beiden Geschlechtern glatt", 6]],
  [["Halsschild-Verbreiterung beim Weibchen so breit wie der ganze Halsschild lang ist", "A:trigonodera"], ["Halsschild-Verbreiterung schmaler, als der Halsschild lang ist", "A:moultoni"]],
  [["Halsschild-Verbreiterung (fast) so breit, wie der hintere Halsschildteil (Männchen) bzw. der ganze Halsschild (Weibchen) lang ist", "A:lobata"], ["Verbreiterung schmaler als diese Längen", 7]],
  [["Hinterecken des 5. und 6. Hinterleibssegments nicht zu großen Lappen verlängert", 8], ["Hinterecken des 5. und 6. Hinterleibssegments zu großen Lappen verlängert", "A:sarawaca"]],
  [["Hinterecken der Halsschild-Verbreiterung hinter der Halsschildmitte", "A:rhombica"], ["Hinterecken der Verbreiterung etwa in der Halsschildmitte", "A:angustata"]],
] };
FIX[24491] = { gen: "Polyspilota", c: [
  [["Vorderschenkel innen mit großem schwarzem Fleck zwischen Basis und Klauenfurche", 2], ["Vorderschenkel innen ohne schwarzen Fleck", 5]],
  [["Hinterer Halsschildteil mindestens 2½-mal so lang wie der vordere", "A:aeruginosa"], ["Hinterer Halsschildteil kürzer", 3]],
  [["Vorderrandfeld der Deckflügel mit parallelen Queräderchen", 4], ["Vorderrandfeld unregelmäßig netzartig", "A:seychelliana"]],
  [["Halsschild schmaler: hinterer Teil doppelt so lang, wie die Verbreiterung breit ist", "A:griffinii"], ["Halsschild breiter: hinterer Teil weniger als doppelt so lang, wie die Verbreiterung breit ist", "A:caffra"]],
  [["Halsschild schlank, mindestens 5-mal so lang, wie die Verbreiterung breit ist", "A:comorana"], ["Halsschild sehr breit, nur 2-mal so lang, wie die Verbreiterung breit ist", "A:magna"]],
] };
FIX[34759] = { gen: "Oxyopsis", c: [
  [["Große Innendornen des Vorderschenkels innen schwarz; Mediastinalader im Vorderrandfeld der Weibchen mit mindestens 9 Schrägästen", 2], ["Große Innendornen nur an der Spitze schwarz; Mediastinalader der Weibchen mit höchstens 7 Ästen", 6]],
  [["Vorderrandfeld der Deckflügel beim Weibchen schmaler oder höchstens so breit wie das halbe Mittelfeld", 3], ["Vorderrandfeld beim Weibchen breiter als das halbe Mittelfeld", 4]],
  [["Größer; Halsschild kräftiger, grob gezähnt; Deckflügel der Weibchen fast so lang wie der Hinterleib, Mittelfeld hinter der Mitte nicht gefenstert, ohne braune Punkte am Flügelmal; Vorderhüften mit 10–12 Dornen", "A:stali"], ["Kleiner; Halsschild der Weibchen schlanker, fein gezähnelt; Deckflügel kürzer als der Hinterleib, Mittelfeld bis zur Spitze gefenstert, Flügelmal vorn und hinten mit braunem Punkt; Vorderhüften mit 9–10 Dornen", "A:saussurei"]],
  [["Mittelfeld der Deckflügel beim Weibchen in der basalen Hälfte gefenstert (mit glasklaren Zellen)", 5], ["Mittelfeld der Deckflügel beim Weibchen nicht gefenstert", "A:lobeter"]],
  [["Deckflügel der Weibchen dicht gefenstert, Spitze gerundet; höchstens 12 Schrägäste der Mediastinalader; Spitzenlappen der Hinterflügel länger als breit, spitzer", "A:rubicunda"], ["Deckflügel weniger dicht gefenstert, Spitze breit gerundet; mehr als 12 Schrägäste; Spitzenlappen der Hinterflügel breiter als lang, stumpf", "A:media"]],
  [["Deckflügel der Weibchen breiter, Spitze breit gerundet; Hinterschenkel so lang wie der hintere Halsschildteil; 1. und 3. Scheibendorn innen schwarz", "A:festae"], ["Deckflügel der Weibchen schmaler, lanzettlich; Hinterschenkel länger als der hintere Halsschildteil; 1. und 3. Scheibendorn nur an der Spitze schwarz", 7]],
  [["Größer; Deckflügel der Weibchen länger als der Hinterleib, spitz lanzettlich; Hinterflügel sehr spitz", "A:acutipennis"], ["Kleiner; Deckflügel der Weibchen kürzer als der Hinterleib, stumpf lanzettlich; Hinterflügel weniger spitz", "A:gracilis"]],
] };

FIX[4586] = { gen: "Eremiaphila", c: [
  [["Vorderhüften innen zumindest teilweise schwarz", 2], ["Vorderhüften innen nicht schwarz, einfarbig", 13]],
  [["Vorderschenkel innen mit schwarzer Binde", 3], ["Vorderschenkel innen ohne schwarze Binde", 5]],
  [["Deckflügel unterseits ohne schwarzen Fleck", "A:typhon"], ["Deckflügel unterseits mit schwarzem Fleck", 4]],
  [["Fleck an der Spitze der Deckflügel", "A:rotundipennis"], ["Fleck kurz vor der Spitze der Deckflügel", "A:sacra"]],
  [["Vorderschenkel innen rotbraun", "A:werneri"], ["Vorderschenkel innen gelbbraun", 6]],
  [["Deckflügel unterseits mit schwarzem Fleck", 7], ["Deckflügel unterseits ohne schwarzen Fleck", 8]],
  [["Seitenränder des Halsschilds gezähnelt", "A:brunii"], ["Seitenränder des Halsschilds glatt", "A:nova"]],
  [["Hinterflügel mit schwärzlichem Fleck", 9], ["Hinterflügel ohne schwärzlichen Fleck", 12]],
  [["Halsschild nach hinten nicht verschmälert", "A:luxori"], ["Halsschild nach hinten verschmälert", 10]],
  [["Klauen der Hinterfüße gleich groß", 11], ["Klauen der Hinterfüße ungleich groß", "A:numida"]],
  [["Hinterhaupt beiderseits neben den Augen mit einem Höcker", "A:spinulosa"], ["Hinterhaupt ohne Höcker", "A:foureaui"]],
  [["Kopf breiter", "A:klunzingeri"], ["Kopf schmaler", "A:cordofana"]],
  [["Deckflügel lang: 1¼- bis 1½-mal so lang wie Kopf und Halsschild zusammen", 14], ["Deckflügel kürzer", 17]],
  [["Hinterflügel ohne schwarzen Fleck", 15], ["Hinterflügel mit schwarzem Fleck", 16]],
  [["Deckflügel rau, ihre Maschen grubig vertieft", "A:cerisyi"], ["Deckflügel netzartig, aber glatt, ohne Grübchen", "A:braueri"]],
  [["Fleck der Hinterflügel vor der Spitze", "A:audouini"], ["Fleck der Hinterflügel ganz an der Spitze", "A:dawidowi"]],
  [["Deckflügel nicht seitlich gestellt, nicht lappenförmig", 18], ["Deckflügel seitlich gestellt, lappenförmig oder fehlend", 32]],
  [["Halsschild mit Höckern bedeckt", 19], ["Halsschild glatt oder mit wenigen Körnchen", 20]],
  [["Hinterflügel ohne Fleck", "A:burmeisteri"], ["Hinterflügel mit schwarzem Fleck", "A:genei"]],
  [["Hinterrand des Halsschilds in der Mitte mit einem Zahn", "A:denticollis"], ["Hinterrand des Halsschilds ohne Zahn", 21]],
  [["Hinterflügel unterseits mit 2 Flecken", "A:moreti"], ["Hinterflügel ohne oder mit nur einem Fleck", 22]],
  [["Hinterflügel fast ganz schwarz", "A:turcica"], ["Hinterflügel nicht ganz schwarz", 23]],
  [["Hinterflügel mit einem Fleck", 24], ["Hinterflügel ohne Fleck", 30]],
  [["Deckflügel unterseits mit schwarzem Fleck", 25], ["Deckflügel unterseits ohne schwarzen Fleck", 26]],
  [["Schulterkante der Deckflügel stark vorspringend", "A:zetterstedti"], ["Schulterkante der Deckflügel nicht vorspringend", "A:arabica"]],
  [["Vorderschenkel innen rotbraun", "A:hedenborgii"], ["Vorderschenkel innen gelbbraun", 27]],
  [["Vorderschiene außen mit 5–7 Dornen", 28], ["Vorderschiene außen mit 2 Dornen", "A:bovei"]],
  [["Hinterhaupt beiderseits am Innenrand der Augen mit kleinem Höcker", "A:dentata"], ["Hinterhaupt ohne Höcker", 29]],
  [["Männchen: äußerer Enddorn des Vorderschenkels größer als die übrigen", "A:heluanensis"], ["Männchen: äußerer Enddorn nicht größer", "A:tunetana"]],
  [["Hinterränder der Hinterleibssegmente in der Mitte mit kleinem Lappen", "A:hebraica"], ["Hinterränder der Hinterleibssegmente ohne Lappen", 31]],
  [["Deckflügel unterseits ohne schwarzen Fleck", "A:somalica"], ["Deckflügel unterseits mit schwarzem Fleck", "A:persica"]],
  [["Vorderrand der Deckflügel gekerbt oder gezähnt", 33], ["Vorderrand der Deckflügel glatt", 35]],
  [["Hinterrand des Halsschilds ohne Mittelzahn", 34], ["Hinterrand des Halsschilds mit Mittelzahn", "A:barbara"]],
  [["Die beiden Innendornen vor der Spitze des Vorderschenkels größer als die übrigen", "A:andresi"], ["Diese beiden Dornen nicht größer", "A:rohlfsi"]],
  [["Klauen der Mittel- und Hinterfüße ungleich", "A:lefebvrii"], ["Klauen der Mittel- und Hinterfüße gleich", 36]],
  [["Hinterleibsrücken zerknittert und rau", 37], ["Hinterleibsrücken glatt oder fast glatt", 38]],
  [["Seitenränder des Halsschilds gekerbt", "A:savignyi"], ["Seitenränder des Halsschilds glatt", "A:cairina"]],
  [["Hinterleibssegmente nahe der Mitte des Hinterrands mit kleinem Lappen", "A:pyramidum"], ["Hinterleibssegmente ohne Lappen", 39]],
  [["Halsschild länger als breit", "A:brevipennis"], ["Halsschild fast so lang wie breit oder breiter als lang", 40]],
  [["Groß (18–21 mm)", "A:nilotica"], ["Kleiner", 41]],
  [["Adern der Deckflügel sichtbar und braun", "A:kheych"], ["Adern der Deckflügel nicht sichtbar, Deckflügel einfarbig", "A:aristidis|A:khamsin|A:khalili|A:anubis"]],
] };

FIX[14772] = { gen: "Hoplocorypha", c: [
  [["Afterdeckplatte am Ende nicht ausgerandet", 2], ["Afterdeckplatte am Ende mehr oder weniger ausgerandet", 17]],
  [["Ränder der Afterdeckplatte zum Ende zusammenlaufend", 3], ["Ränder der Afterdeckplatte fast parallel", 13]],
  [["Körper schwarz oder schwärzlich", 4], ["Körper gräulich oder gelbbraun", 8]],
  [["2. Scheibendorn beim Weibchen an der Basis schwarz; Männchen flügellos", "A:atra"], ["2. Scheibendorn ganz gelbbraun; Männchen geflügelt", 5]],
  [["Afterdeckplatte länger als breit; Hinterleibssegmente 1–3 der Weibchen mit Lappen", 6], ["Afterdeckplatte nicht länger als breit; Segmente 1–3 der Weibchen gezähnt", 7]],
  [["Hinterleibslappen der Weibchen mit mehreren Kielen", "A:picea"], ["Hinterleibslappen der Weibchen mit zwei Kielen", "A:carli"]],
  [["Hinterer Halsschildteil länger als die Vorderhüften; Deckflügel der Männchen länger", "A:acuta"], ["Hinterer Halsschildteil beim Weibchen kürzer als die Vorderhüften; Deckflügel der Männchen kürzer", "A:fumosa"]],
  [["Vorderschenkel mit 2 Scheibendornen", "A:bispina"], ["Vorderschenkel mit 3 Scheibendornen", 9]],
  [["Afterdeckplatte mehr oder weniger spitz", 10], ["Afterdeckplatte am Ende gerundet", 12]],
  [["Hinterleibssegmente 1–3 der Weibchen mit Lappen; Deckflügel der Männchen braun gesprenkelt", "A:foliata"], ["Segmente 1–3 der Weibchen ohne Lappen; Deckflügel der Männchen nicht gesprenkelt", 11]],
  [["Halsschild kürzer; Vorderhüften reichen fast bis zur Basis der Vorderbrust", "A:nana"], ["Halsschild länger; Vorderhüften reichen nur wenig über die Mitte des hinteren Halsschildteils", "A:dentata"]],
  [["Hinterleibslappen der Weibchen breiter; Deckflügel der Männchen braun gesprenkelt", "A:punctata"], ["Hinterleibslappen der Weibchen sehr klein; Deckflügel der Männchen nicht gesprenkelt", "A:macra"]],
  [["Hinterleibssegmente 2–3 der Weibchen mit Lappen; Deckflügel der Männchen braun gesprenkelt", 14], ["Segmente 2–3 der Weibchen ohne Lappen; Deckflügel der Männchen nicht gesprenkelt", 15]],
  [["Afterdeckplatte zum Ende nicht verschmälert, breit gerundet", "A:narocana"], ["Afterdeckplatte zum Ende etwas verschmälert und etwas eckig", "A:bottegi"]],
  [["Ende der Afterdeckplatte stumpfwinklig", "A:vittata"], ["Ende der Afterdeckplatte gerundet", 16]],
  [["Hinterer Halsschildteil des Weibchens so lang wie die Vorderhüften", "A:mellea"], ["Hinterer Halsschildteil länger als die Vorderhüften", "A:garuana"]],
  [["Afterdeckplatte der Männchen am Ende ohne Zähnchen", 18], ["Afterdeckplatte der Männchen am Ende mit Zähnchen", "A:boromensis"]],
  [["Afterdeckplatte viel breiter als lang (quer)", "A:aurita"], ["Afterdeckplatte nicht quer", 19]],
  [["Männchen flügellos", "A:boviformis"], ["Männchen geflügelt", 20]],
  [["Hinterleibssegmente 2–3 der Weibchen mit Lappen; Deckflügel der Männchen braun gesprenkelt", 21], ["Hinterleibssegmente der Weibchen nur mit sehr kleinen Läppchen oder kaum gezähnt; Deckflügel der Männchen nicht gesprenkelt", 25]],
  [["Afterdeckplatte am Ende breit, aber flach ausgerandet; Deckflügel der Männchen wenig gesprenkelt", 22], ["Afterdeckplatte der Weibchen schmal und tief eingeschnitten; Deckflügel der Männchen stärker gesprenkelt", 24]],
  [["Ausrandung der Afterdeckplatte kaum ausgeprägt, breit bogig", 23], ["Ausrandung der Afterdeckplatte deutlich winklig", "A:cacomana"]],
  [["Afterdeckplatte zum Ende etwas verschmälert", "A:montana"], ["Afterdeckplatte fast quadratisch, mit parallelen Rändern", "A:perplexa"]],
  [["Hinterer Halsschildteil länger als die Vorderhüften", "A:sordida"], ["Hinterer Halsschildteil beim Weibchen kürzer, beim Männchen so lang wie die Vorderhüften", "A:rapax"]],
  [["Hinterleibssegmente 2–3 der Weibchen mit sehr kleinen Lappen", "A:saussurii"], ["Hinterleibssegmente der Weibchen nur mit einem kleinen Zahn", 26]],
  [["Vorderhüften schwarz", "A:nigra"], ["Vorderhüften gelbbraun", "A:congica"]],
] };

FIX[6516] = { gen: "Tarachodes", c: [
  [["Scheitel in der Mitte mit kegelförmigem Höcker", "A:oxycephalus"], ["Scheitel ohne kegelförmigen Höcker", 2]],
  [["Vorderhüften innen mehr oder weniger schwarz", 3], ["Vorderhüften innen gelb (höchstens Spitze bzw. Basis schwarz gezeichnet)", 18]],
  [["Vorderschenkelringe (Trochanter) innen ganz schwarz", 4], ["Vorderschenkelringe innen gelb oder nur mit schwarzem Fleck", 6]],
  [["Hinterer Teil der Vorderbrust fast ganz schwarz", 5], ["Hinterer Teil der Vorderbrust gelb, nur mit schwarzer Querbinde", "A:taboranus"]],
  [["Scheitel neben den Augen ohne kegelförmige Höcker", "A:maurus"], ["Scheitel neben den Augen mit 2 kegelförmigen Höckern", "A:bicornis"]],
  [["Vorderschenkelringe innen mit schwarzem Fleck", 7], ["Vorderschenkelringe innen gelb, ohne Fleck", 14]],
  [["Vorderhüften innen gekörnt", 8], ["Vorderhüften innen glatt", 11]],
  [["Scheitelrand gebogen", 9], ["Scheitelrand gerade, abgestutzt", "A:dives"]],
  [["Vorderschienen innen nicht schwarz", 10], ["Vorderschienen innen schwarz", "A:griffinii"]],
  [["Scheitelrand schärfer, gebogen", "A:irroratus"], ["Scheitelrand weniger scharf, etwas vieleckig mit 6 sehr kleinen Vorsprüngen", "A:afzelii"]],
  [["Vorderhüften innen ganz schwarz", 12], ["Vorderhüften innen teilweise schwarz", 13]],
  [["Hinterleibsunterseite ungefleckt; Halsschildhöcker der Weibchen sehr hoch, nach vorn gebogen, stark zernagt", "A:monstrosus"], ["Hinterleibsunterseite auf jedem Segment mit 2 länglichen, schrägen schwarzen Flecken", "A:usambaricus"]],
  [["Vorderschienen innen schwärzlich", "A:bandanus"], ["Vorderschienen innen nicht schwärzlich", "A:grisous"]],
  [["Der schwarze Innenfleck des Vorderschenkels reicht bis zu den Dornen", "A:dissimulator"], ["Der Fleck reicht nicht bis zu den Dornen", 15]],
  [["Hinterleibsunterseite mit Flecken oder kleinen schwarzen Punkten", 16], ["Hinterleibsunterseite ungefleckt", "A:karnyi"]],
  [["Hinterleibsunterseite auf jedem Segment mit 2 länglichen schwarzen Flecken", "A:sacer"], ["Hinterleibsunterseite auf jedem Segment mit 2 kleinen schwarzen Punkten", 17]],
  [["Innendornen des Vorderschenkels schwarz", "A:werneri"], ["Innendornen des Vorderschenkels nur an der Spitze schwarz", "A:tananus"]],
  [["Vorderschenkelringe innen schwarz oder rötlich gezeichnet", 19], ["Vorderschenkelringe innen ungefleckt", 26]],
  [["Vorderbrust im hinteren Teil fast ganz schwarz", 20], ["Vorderbrust nur mit schwarzer Querbinde vor dem Hinterrand", 21]],
  [["Bauchsegmente beiderseits mit querem schwarzem Fleck", "A:sanctus"], ["Bauchsegmente beiderseits mit rundem schwarzem Punkt", "A:insidiator"]],
  [["Hinterflügel der Männchen im Analfeld mit kleinen rauchigen Flecken in den Zellen", 22], ["Hinterflügel der Männchen ganz glasklar", 25]],
  [["Ockerfarben", "A:gilvus"], ["Gräulich", 23]],
  [["Vorderschienen der Weibchen innen schwarz", 24], ["Vorderschienen der Weibchen innen nicht schwarz", "A:obtusiceps"]],
  [["Größer", "A:smithi"], ["Kleiner", "A:orientalis"]],
  [["Vorderschienen innen schwarz", "A:aestuans"], ["Vorderschienen innen nicht schwarz", "A:saussurei"]],
  [["Vorderschenkel innen fast in der ganzen unteren Hälfte schwarz", "A:feae"], ["Vorderschenkel innen gelb oder mit schwarzem Längsfleck", 27]],
  [["Scheitelrand abgestutzt, gerade, scharf, beiderseits mit kleinem vorstehendem Höcker", 28], ["Scheitelrand mehr oder weniger gebogen oder gerade, ohne Höcker", 31]],
  [["Stirnschild ohne schwarze Binde", 29], ["Stirnschild mit schwarzer Binde", 30]],
  [["Größer", "A:okahandyanus"], ["Kleiner", "A:ugandensis"]],
  [["Vorderschenkel innen einfarbig gelblich", "A:lucubrans"], ["Vorderschenkel innen mit schwarzem Längsfleck", "A:fraterculus"]],
  [["Stirnschild mit schwarzer Querbinde", 32], ["Stirnschild ohne schwarze Binde", 37]],
  [["Hinterflügel der Männchen glasklar", 33], ["Hinterflügel der Männchen rauchig", "A:rotundiceps"]],
  [["Hinterer Teil der Vorderbrust schwarz mit breiter gelblicher Binde am Hinterrand", 34], ["Hinterer Teil der Vorderbrust bis zum Hinterrand schwarz", "A:kibweziana"]],
  [["Vorderecken des Halsschilds ohne Zähnchen", "A:karschii"], ["Vorderecken des Halsschilds mit vorstehendem Zähnchen", 35]],
  [["Scheitelrand leicht gebogen", 36], ["Scheitelrand ganz gerade abgestutzt", "A:alluaudi"]],
  [["Halsschild breiter, weniger als doppelt so lang wie breit", "A:chopardii"], ["Halsschild schlanker, mindestens doppelt so lang wie breit", "A:sjoestedti"]],
  [["Größer: Halsschild länger als 5 mm; Mittel- und Hinterbeine behaart", 38], ["Sehr klein: Halsschild höchstens 5 mm; Mittel- und Hinterbeine kahl", "A:minima"]],
  [["Vorderbrust mit schwarzer Querbinde vor dem Hinterrand", "A:maculisternum"], ["Vorderbrust fast ganz schwarz, nur am Hinterrand gelb gebändert", "A:gerstaeckeri"]],
] };

FIX[30237] = { gen: "Acontista", c: [
  [["Gräulich; Hinterflügel der Weibchen im Mittelfeld schwärzlich, undurchsichtig; Hinterflügel der Männchen ganz glasklar, nur die Spitze schwarz", 2], ["Grünlich; Mittelfeld der Hinterflügel beim Weibchen ocker oder gelb; Hinterflügel der Männchen glasklar oder bräunlich gefleckt", 4]],
  [["Flügelmal der Deckflügel schwarz", 3], ["Flügelmal wie der übrige Deckflügel gefärbt", "A:fuscata"]],
  [["Große Innendornen des Vorderschenkels schwarz; Deckflügel der Männchen mit 2 schwärzlichen Binden", "A:fusca"], ["Große Innendornen nur an der Spitze schwarz; Deckflügel der Männchen ohne schwarze Binden", "A:perspicua"]],
  [["Flügelmal der Deckflügel schwarz oder schwärzlich", 5], ["Flügelmal wie der übrige Deckflügel gefärbt", 14]],
  [["Deckflügel der Weibchen länger als der Halsschild", 6], ["Deckflügel der Weibchen kaum so lang wie der Halsschild", "A:rehni"]],
  [["Deckflügel der Männchen glasklar; Mittel- und Hinterbeine der Weibchen grün oder bräunlich geringelt", 7], ["Deckflügel der Männchen mehr oder weniger bräunlich gefleckt; Beine der Weibchen nicht geringelt", 9]],
  [["Halsschild weniger schlank; Hinterflügel der Männchen ganz glasklar", 8], ["Halsschild schlanker; Hinterflügel der Männchen mit schwärzlichem Fleck am Hinterrand", "A:cordillerae"]],
  [["Afterdeckplatte der Weibchen kaum doppelt so breit wie lang; Vorderrandfeld der Hinterflügel beim Männchen leicht gelblich-rauchig", "A:mexicana"], ["Afterdeckplatte der Weibchen dreimal so breit wie lang; Vorderrandfeld beim Männchen fast glasklar", "A:multicolor"]],
  [["Hinterflügel der Männchen an der Basis rauchig", 10], ["Hinterflügel der Männchen an der Basis glasklar", 12]],
  [["Deckflügel der Männchen an der Basis rauchig", 11], ["Deckflügel der Männchen an der Basis nicht rauchig", "A:chopardi"]],
  [["Deckflügel der Männchen an der Spitze mit bräunlichem Fleck", "A:inquinata"], ["Deckflügel der Männchen ohne Fleck an der Spitze", "A:championi"]],
  [["Mittelfeld der Hinterflügel beim Männchen durchsichtig", 13], ["Mittelfeld der Hinterflügel beim Männchen teilweise undurchsichtig", "A:minima"]],
  [["Knie der Mittel- und Hinterbeine schwarz", "A:maroniensis"], ["Knie der Mittel- und Hinterbeine gleichfarbig", "A:festae"]],
  [["Hinterflügel der Männchen ganz glasklar", 15], ["Hinterflügel der Männchen mehr oder weniger bräunlich gefleckt; Deckflügel der Weibchen länger als der Halsschild", 16]],
  [["Vorderrandfeld der Deckflügel beim Männchen glasklar; Deckflügel der Weibchen so kurz wie der Halsschild", "A:brevipennis"], ["Vorderrandfeld der Deckflügel beim Männchen undurchsichtig", "A:vitrea"]],
  [["Deckflügel bei beiden Geschlechtern ungefleckt", 17], ["Deckflügel bei beiden Geschlechtern gefleckt", 20]],
  [["Hinterflügel der Weibchen in der basalen Hälfte des Analfelds undurchsichtig ocker", 18], ["Hinterflügel der Weibchen nur ganz an der Basis des Analfelds ocker", 19]],
  [["Rauchige Binde der Hinterflügel beim Weibchen fast so breit wie das halbe Analfeld", "A:amoenula"], ["Rauchige Binde schmaler", "A:semirufa"]],
  [["Hinterflügel der Männchen mit schwarzem Fleck im Mittelfeld; Spitze des Mittelfelds beim Weibchen glasklar", "A:eximia"], ["Hinterflügel der Männchen ohne Fleck; Spitze des Mittelfelds beim Weibchen undurchsichtig ocker", "A:concinna"]],
  [["Mittelfeld der Hinterflügel beim Weibchen undurchsichtig", 21], ["Mittelfeld der Hinterflügel beim Weibchen durchsichtig", "A:cayennensis"]],
  [["Basis des Analfelds der Hinterflügel beim Weibchen undurchsichtig gelb", 22], ["Basis des Analfelds beim Weibchen durchsichtig gelblich", "A:quadrimaculata"]],
  [["Spitze der Hinterflügel beim Weibchen gerundet", "A:aurantiaca"], ["Spitze der Hinterflügel beim Weibchen abgestutzt", "A:bolivarii"]],
] };
FIX[31592] = { gen: "Acromantis", c: [
  [["Deckflügel kaum so lang wie der Hinterleib", "A:hesione"], ["Deckflügel länger als der Hinterleib", 2]],
  [["Oberkante des Vorderschenkels vor der Spitze deutlich eingebuchtet", "A:australis"], ["Oberkante schräg, aber nicht eingebuchtet", 3]],
  [["Große Innendornen des Vorderschenkels nur an der Spitze schwarz", 4], ["Große Innendornen ganz schwarz", 7]],
  [["Scheitel über den Punktaugen ganz ohne Höcker", 5], ["Scheitel über den Punktaugen mit mindestens einem Höcker", 6]],
  [["Mittelfeld der Deckflügel beim Weibchen entlang der Radialadern sehr dicht und fein genetzt", "A:javana"], ["Mittelfeld beim Weibchen weniger dicht genetzt", "A:moultoni"]],
  [["Mittelfeld der Deckflügel beim Weibchen sehr dicht und fein genetzt; Halsschildränder der Männchen unbewehrt", "A:oligoneura"], ["Mittelfeld beim Weibchen weitmaschig; Halsschildränder der Männchen fein gezähnelt", "A:insularis"]],
  [["Scheitel über den Punktaugen ganz ohne Höcker", 8], ["Scheitel mit mindestens einem kleinen Höcker", 12]],
  [["Mittelfeld der Deckflügel sehr dicht genetzt", "A:japonica"], ["Mittelfeld der Deckflügel weitmaschiger", 9]],
  [["Deckflügel ohne rauchige Binden", 10], ["Deckflügel mit deutlichen Binden", "A:westwoodi"]],
  [["Vorderhüften unbedornt", "A:formosana"], ["Vorderhüften fein bedornt", 11]],
  [["Vorderhüften mit 6–7 Dornen", "A:siporana"], ["Vorderhüften mit 10–12 Dornen", "A:indica"]],
  [["Höcker über den Punktaugen sehr klein", "A:montana"], ["Höcker über den Punktaugen ziemlich lang, kegelförmig, spitz", "A:gestri"]],
] };

FIX[15893] = { gen: "Angela", c: [
  [["Hinterflügel fast ganz gelb oder orange", 2], ["Hinterflügel rauchig oder glasklar, mit oder ohne gelbe Flecken", 3]],
  [["Hinterflügel leuchtend rotorange", "A:miranda"], ["Hinterflügel gelb", "A:perpulchra"]],
  [["Halsschildränder kräftig gezähnt", "A:fulgida"], ["Halsschildränder glatt oder schwach gezähnelt", 4]],
  [["Vorderschenkel außen mit 5 Dornen", "A:decolor"], ["Vorderschenkel außen mit 4 Dornen", 5]],
  [["Vorderschiene außen mit 6 Dornen", 6], ["Vorderschiene außen mit 5 Dornen", 7]],
  [["Sehr groß (Weibchen etwa 140 mm); Halsschild glänzend", "A:maxima"], ["Kleiner (Weibchen etwa 97 mm); Halsschild matt", "A:lemoulti"]],
  [["Analfeld der Hinterflügel mit gelben und schwärzlichen Binden", 8], ["Analfeld der Hinterflügel nur mit schwärzlichen Flecken", 15], ["Hinterflügel in der Endhälfte schwärzlich, in der basalen Hälfte glasklar", 16]],
  [["Flügelmal der Deckflügel bräunlich", 9], ["Flügelmal gleichfarbig", 10]],
  [["Cerci am Ende ausgerandet", "A:saussurii"], ["Cerci am Ende abgestutzt", "A:trifasciata"]],
  [["Hinterflügel der Männchen in der basalen Hälfte glasklar", 11], ["Hinterflügel der Männchen bis zur Basis rauchig", "A:minor"]],
  [["Cerci breit, am Ende abgestutzt", 12], ["Cerci zum Ende verschmälert und gerundet", "A:werneri"]],
  [["Hinterflügel mit 2–3 gelben Flecken", 13], ["Hinterflügel mit nur einem gelben Fleck", "A:subhyalina"]],
  [["Gelbe Flecken der Hinterflügel deutlich", 14], ["Gelbe Flecken der Hinterflügel undeutlich", "A:purpurascens"]],
  [["Größer (Halsschild des Weibchens etwa 49 mm)", "A:championi|A:quinquemaculata"], ["Kleiner (Weibchen etwa 37 mm, Männchen 25 mm)", "A:guianensis"]],
  [["Hinterflügel mit 2–3 schwärzlichen Binden", "A:subhyalina"], ["Hinterflügel mit 4 schwärzlichen Binden", "A:purpurascens"]],
  [["Kleiner (Halsschild des Männchens etwa 25 mm)", "A:guianensis"], ["Größer (Halsschild des Männchens etwa 30 mm)", "A:peruviana"]],
] };
FIX[23322] = { gen: "Stagmomantis", c: [
  [["Halsschild länger; hinterer Teil etwas länger als die Vorderhüften", 2], ["Halsschild kürzer; hinterer Teil höchstens so lang wie die Vorderhüften", "A:conspersa|A:fraterna|A:maya"]],
  [["Hinterflügel der Weibchen einfarbig violettschwarz", "A:coerulans"], ["Hinterflügel der Weibchen bräunlich rauchig oder gelb, aber mit gelblichen oder glasklaren Queräderchen", 3]],
  [["Dornen der Vorderhüften schwarz", 4], ["Dornen der Vorderhüften nicht schwarz", 6]],
  [["Vorderschenkel innen auf der Klauenfurche mit schwarzem Fleck", 5], ["Vorderschenkel ohne schwarzen Fleck", "A:latipennis"]],
  [["Hinterflügel der Männchen glasklar, gefleckt, im Analfeld rauchig; Mittelfeld der Hinterflügel beim Weibchen ocker, an der Spitze schwärzlich", "A:carolina"], ["Hinterflügel der Männchen ganz schwärzlich mit glasklaren Queräderchen; Mittelfeld beim Weibchen ganz schwärzlich", "A:nordica"]],
  [["Glieder der Vorderfüße an der Spitze innen schwarz", 7], ["Glieder der Vorderfüße an der Spitze nicht schwarz", "A:simplex"]],
  [["Große Innendornen des Vorderschenkels innen schwärzlich", 8], ["Große Innendornen nur an der Spitze schwarz", 9]],
  [["Hinterflügel im Analfeld rauchig", "A:inquinata"], ["Hinterflügel der Männchen im Analfeld kaum oder nicht rauchig; beim Weibchen gelb gewürfelt", "A:ferox"]],
  [["Hinterflügel der Weibchen im Analfeld ohne schwarze Flecken", "A:polita"], ["Hinterflügel der Weibchen im Analfeld mit schwarzen Flecken", 10]],
  [["Mittelfeld der Hinterflügel beim Weibchen durchscheinend, einfarbig", "A:stollii"], ["Mittelfeld beim Weibchen undurchsichtig, aber mit glasklaren Zellen", "A:dimidiata"]],
] };
FIX[33327] = { gen: "Creobroter", c: [
  [["Scheitel ohne Höcker; Deckflügel der Männchen ohne Binde", "A:sumatranus"], ["Scheitel mit Höcker; Deckflügel der Männchen mit Binde", 2]],
  [["Ränder der Deckflügelbinde fast parallel", 3], ["Ränder der Deckflügelbinde gebogen", 4]],
  [["Mittelfeld der Hinterflügel rosa", "A:granulicollis"], ["Mittelfeld der Hinterflügel schmutzig glasklar", "A:medanus"]],
  [["Hinterschenkel so lang wie der Halsschild", "A:episcopalis"], ["Hinterschenkel länger als der Halsschild", 5]],
  [["Vorderhüften mit 18 ziemlich kräftigen Dornen", "A:fuscoareatus"], ["Vorderhüften mit weniger Dornen", 6]],
  [["Hinterflügel der Männchen im Analfeld in der Mitte rauchig; Hinterflügel der Weibchen an der Basis grün", "A:pictipennis"], ["Hinterflügel der Männchen an der Basis rosa; Hinterflügel der Weibchen an der Basis blutrot", 7]],
  [["Hautsaum (Analfeld) der Deckflügel beim Weibchen schwärzlich mit hellen Adern", "A:meleagris"], ["Hautsaum mit schwarzen Adern", 8]],
  [["Deckflügelbinde beim Weibchen vor der Mitte", "A:laevicollis"], ["Deckflügelbinde beim Weibchen in der Mitte", 9]],
  [["Vorderrandfeld der Hinterflügel beim Weibchen gelblich", "A:apicalis"], ["Vorderrandfeld der Hinterflügel beim Weibchen blutrot", 10]],
  [["Deckflügel des Weibchens an der Basis bräunlich", "A:signifer"], ["Deckflügel des Weibchens an der Basis grün", 11]],
  [["Vorderhüften beim Männchen unbedornt, beim Weibchen fein gezähnt", "A:discifer"], ["Vorderhüften beim Männchen gezähnelt, beim Weibchen ziemlich kräftig gezähnt", 12]],
  [["Größer; Faltader im Analfeld der Deckflügel mit 3 Ästen; Deckflügel der Männchen mit gelbem Basalfleck", "A:gemmatus"], ["Kleiner; Faltader mit nur 2 Ästen; Deckflügel der Männchen ohne Basalfleck", "A:urbanus"]],
] };

FIX[11578] = { gen: "Amantis", c: [
  [["Vorderschenkel schwarz", 2], ["Vorderschenkel gelblich oder schwarz marmoriert", 6]],
  [["Vorderhüften ganz gelb", 3], ["Vorderhüften zur Spitze hin schwarz", 5]],
  [["Deckflügel stärker rauchig; Queräderchen im Vorderrandfeld schwärzlich", "A:irina"], ["Deckflügel gelblich; Queräderchen im Vorderrandfeld blassgelb", 4]],
  [["2. Glied der Vorderfüße schwarz", "A:subirina"], ["2. Glied der Vorderfüße gelbbraun", "A:indica"]],
  [["Basis der Vorderhüften schwarz", "A:malayana"], ["Basis der Vorderhüften gelb", "A:philippina"]],
  [["1. Glied der Vorderfüße schwarz", "A:reticulata"], ["1. Glied der Vorderfüße gelbbraun", 7]],
  [["Deckflügel der Männchen rauchig", "A:bolivarii"], ["Deckflügel der Männchen fast glasklar", 8]],
  [["Erstes Glied der Vorderfüße ganz gelbbraun", "A:saussurei"], ["Erstes Glied der Vorderfüße an der Spitze schwarz", "A:gestri|A:reticulata"]],
] };
FIX[17323] = { gen: "Thesprotia", c: [
  [["Hinterer Halsschildteil länger als die Vorderhüften", 2], ["Hinterer Halsschildteil so lang wie die Vorderhüften", 10]],
  [["Vorderschiene außen an der Basis ohne Dorn", 3], ["Vorderschiene an der Basis mit einem Dorn", "A:fuscipennis"]],
  [["Halsschild der Weibchen lang (24–26 mm)", 4], ["Halsschild der Weibchen kürzer", 6]],
  [["Afterdeckplatte der Weibchen kurz, am Ende gerundet", "A:maculata"], ["Afterdeckplatte der Weibchen länger, spitz", 5]],
  [["Mittelbeine kurz", "A:filum"], ["Mittelbeine lang", "A:gigas"]],
  [["Deck- und Hinterflügel der Männchen rauchig", 7], ["Deck- und Hinterflügel der Männchen nicht rauchig", 8]],
  [["Queräderchen der Deckflügel an ihrem Ansatz verdickt", "A:infumata"], ["Queräderchen der Deckflügel beim Männchen am Ansatz nicht verdickt", "A:graminis"]],
  [["Hinterer Halsschildteil mehr als 3-mal so lang wie der vordere", 9], ["Hinterer Halsschildteil kaum 3-mal so lang wie der vordere", "A:brevis"]],
  [["Halsschild 15–16 mm lang", "A:subhyalina"], ["Halsschild 12–13 mm lang", "A:macilenta"]],
  [["Queräderchen der Deckflügel am Ansatz verdickt", "A:pellucida|A:brasiliensis"], ["Queräderchen der Deckflügel nicht verdickt", "A:simplex"]],
] };
FIX[37128] = { gen: "Danuria", c: [
  [["Scheitel in der Mitte ohne Höcker", "A:bolauana"], ["Scheitel zwischen den Augen mit 2 oder 4 Höckern", 2]],
  [["Mittelschenkel unten nahe der Spitze mit (manchmal sehr kleinem) Lappen", 3], ["Mittelschenkel ganz einfach", 9]],
  [["Vorderhüften so lang wie der hintere Halsschildteil", 4], ["Vorderhüften kürzer", 8]],
  [["Mittelschienen oben vor der Mitte mit kleinem Lappen", 5], ["Mittelschienen ohne Lappen", 6]],
  [["Weniger schlank; Halsschild kräftiger, Randdornen kürzer und stumpf", "A:zambesica"], ["Schlanker; Halsschild schmaler, Randdornen länger und spitzer", "A:kilimandjarica"]],
  [["Halsschild kürzer (Weibchen 20 mm)", "A:affinis"], ["Halsschild länger (25–30 mm)", 7]],
  [["Halsschild 25 mm (Weibchen); Lappen vor der Spitze der Mittelschenkel deutlicher", "A:barbozae"], ["Halsschild 30 mm (Weibchen); Lappen der Mittelschenkel sehr schmal, kaum erkennbar", "A:congica"]],
  [["3. Scheibendorn des Vorderschenkels innen fast ganz schwarz", "A:thunbergi"], ["3. Scheibendorn nur an der Spitze schwarz", "A:buchholzi"]],
  [["Hinterer Halsschildteil mindestens 3-mal so lang wie der vordere", 10], ["Hinterer Halsschildteil kürzer", 11]],
  [["Hinterer Halsschildteil mehr als 3-mal so lang wie der vordere", "A:angolensis"], ["Hinterer Halsschildteil kürzer", "A:gracilis|A:contorta"]],
  [["Vorderer Halsschildteil breiter als der hintere", "A:impannosa"], ["Vorderer Halsschildteil nicht breiter als der hintere", 12]],
  [["Halsschild länger (Weibchen 28–30 mm)", "A:obscuripennis"], ["Halsschild kürzer (Weibchen 22–23 mm)", "A:schweinfurthi"]],
] };

FIX[35489] = { gen: "Stagmatoptera", c: [
  [["Deckflügel auf Höhe des Flügelmals mit schwärzlichem Fleck oder Band", 2], ["Deckflügel ohne Fleck und ohne Band", "A:indicator"]],
  [["Deckflügel mit rundem Fleck", 3], ["Deckflügel mit schwärzlichem Band", "A:abdominalis"]],
  [["Der Dorn vor der Klaue der Vorderschiene innen ganz schwarz", 4], ["Dieser Dorn nur an der Spitze schwarz", 8]],
  [["Die ersten 3 Scheibendornen innen ganz schwarz", 5], ["Die ersten 3 Scheibendornen nur an der Spitze schwarz", "A:septentrionalis"]],
  [["Vorderschienen innen in der Mitte schwarz gezeichnet; Deckflügel der Weibchen mit großem, fast die ganze Breite einnehmendem schwarzem Fleck; Hinterflügel der Weibchen gelb, undurchsichtig, nur vor dem Hinterrand mit gelben Binden", 6], ["Vorderschienen in der Mitte nicht schwarz; Deckflügel der Weibchen mit kleinem Fleck; Hinterflügel der Weibchen ganz von gelben Binden durchzogen", "A:pia"]],
  [["Halsschild kräftiger, Verbreiterung größer; Deckflügel der Weibchen breiter; Deckflügel der Männchen hinter dem Flügelmal entlang der Radialadern undurchsichtig", 7], ["Halsschild schlanker, Verbreiterung schmaler; Deckflügel der Weibchen schmaler; Mittelfeld der Deckflügel beim Männchen ganz glasklar", "A:flavipennis"]],
  [["Deckflügel der Männchen vor dem Flügelmal im Mittelfeld glasklar", "A:supplicaria"], ["Deckflügel der Männchen vor dem Flügelmal und entlang der Radialadern undurchsichtig", "A:incerta"]],
  [["Halsschildränder bei beiden Geschlechtern kräftig gezähnt; Halsschild schlanker, länger", "A:binotata"], ["Halsschildränder schwächer gezähnt, bei Männchen fast unbewehrt", 9]],
  [["Innenfleck des Vorderschenkels reicht mindestens bis zum 4. großen Randdorn", 10], ["Innenfleck reicht nur bis zum 3. großen Randdorn", 12]],
  [["Große innere Randdornen des Vorderschenkels innen ganz schwarz", "A:femoralis"], ["Große innere Randdornen nur an der Spitze schwarz", 11]],
  [["Halsschild-Verbreiterung breiter als der vordere Halsschildteil lang; Innenfleck des Vorderschenkels reicht bis zum 5. großen Randdorn", "A:biocellata"], ["Verbreiterung so breit wie der vordere Halsschildteil lang; Innenfleck reicht nur bis zum 4. großen Randdorn", "A:ignota"]],
  [["Deckflügelfleck nicht augenförmig, kleiner, erreicht die Mitte des Mittelfelds nicht", "A:precaria"], ["Deckflügelfleck augenförmig, größer, reicht mindestens bis zur Mitte des Mittelfelds", "A:hyaloptera"]],
] };
FIX[30896] = { gen: "Acanthops", c: [
  [["Vorderschenkel ohne Lappen an der Basis der Oberkante; Mittelschienen kaum oder nicht verbreitert", 2], ["Vorderschenkel mit Lappen; Mittelschienen oben in der basalen Hälfte mit etwas lappenartigem Kiel", 5]],
  [["Deckflügel des Weibchens ohne sichelförmigen Spitzenlappen", "A:brunneri"], ["Deckflügel des Weibchens mit sichelförmigem Spitzenlappen", 3]],
  [["Deckflügel des Männchens an der Spitze nicht in einen kleinen Lappen ausgezogen", "A:godmani"], ["Deckflügel des Männchens an der Spitze in einen kleinen Lappen ausgezogen", 4]],
  [["Vorderrandfeld der Deckflügel beim Männchen breiter als das halbe Mittelfeld; Hinterflügel des Weibchens mit gerundetem Mittelfeldende, Schulterbucht deutlich", "A:falcataria|A:bolivari"], ["Mittelfeld beim Männchen viel schmaler; Hinterflügel des Weibchens an der Spitze abgestutzt, keine Schulterbucht", "A:erosa"]],
  [["Halsschild des Weibchens auf dem vorderen Teil mit Höckern", 6], ["Halsschild des Weibchens ohne Höcker", 7]],
  [["Halsschild länger; Hinterflügel der Männchen schwarz gebändert; Hinterflügel des Weibchens an der Spitze abgestutzt und eingebuchtet", "A:tuberculata"], ["Halsschild kürzer; Hinterflügel der Männchen rauchig; Hinterflügel des Weibchens abgestutzt, kaum eingebuchtet", "A:erosula"]],
  [["Vorderer Halsschildteil des Weibchens mit wenigen verstreuten Körnchen", "A:griffinii"], ["Vorderer Halsschildteil des Weibchens dicht gekörnt; Hinterbeine der Männchen dicht und lang behaart", "A:falcata"]],
] };
FIX[26051] = { gen: "Sphodromantis", c: [
  [["Halsschild nur im vorderen Teil verbreitert", 2], ["Halsschild auch im hinteren Teil breit blattartig verbreitert", "A:scutata"]],
  [["Vorderhüften innen mit schwarzem Fleck", "A:biocellata"], ["Vorderhüften innen ohne schwarzen Fleck", 3]],
  [["Dornen der Vorderhüften an der Basis nicht verdickt, aber an der Basis einiger Dornen glatte, runde Schwielenflecken", 4], ["Einige Dornen der Vorderhüften an der Basis knopfartig verdickt; keine Schwielenflecken", 11]],
  [["Vorderschenkel innen ungefleckt", 5], ["Vorderschenkel innen gefleckt", 10]],
  [["Deckflügel auch beim Weibchen länger als der Hinterleib", 6], ["Deckflügel der Weibchen kürzer als oder so lang wie der Hinterleib", 8]],
  [["Halsschild hinter der Verbreiterung plötzlich verschmälert; Vorderrandfeld der Deckflügel beim Weibchen schmaler als das halbe Mittelfeld", 7], ["Halsschild hinter der Verbreiterung allmählich verschmälert; Vorderrandfeld so breit wie das halbe Mittelfeld", "A:kersteni"]],
  [["Mittelfeld der Deckflügel beim Weibchen undurchsichtig", "A:viridis"], ["Mittelfeld der Deckflügel beim Weibchen häutig, durchscheinend", "A:arabica"]],
  [["Scheibendornen nur mit schwarzer Spitze", "A:fenestrata"], ["Die ersten 2 Scheibendornen innen schwarz", 9]],
  [["Auch der 3. Scheibendorn innen schwarz", "A:uebina"], ["3. Scheibendorn nur an der Spitze schwarz", "A:fulva"]],
  [["Flügelmal sehr groß; Zähne am Halsschildrand gleichfarbig", "A:occidentalis"], ["Flügelmal sehr klein; Zähne am Halsschildrand schwarz", "A:aurea"]],
  [["Halsschild-Verbreiterung reicht nicht bis zur Mitte des hinteren Halsschildteils", 12], ["Verbreiterung reicht bis zur Mitte des hinteren Halsschildteils oder darüber", 16]],
  [["Flügelmal klein", 13], ["Flügelmal sehr groß", "A:gestri"]],
  [["Deckflügel der Weibchen doppelt so lang wie der Halsschild; Vorderhüften der Männchen zwischen den Knopfdornen glatt oder kaum gezähnelt", "A:lineola"], ["Deckflügel der Weibchen kürzer als 2 Halsschildlängen; Vorderhüften der Männchen zwischen den Knopfdornen bedornt", 14]],
  [["Hinterer Halsschildteil beim Männchen fast 2½-mal, beim Weibchen mehr als 2-mal so lang wie der vordere", "A:gastrica"], ["Hinterer Halsschildteil beim Männchen kürzer", 15]],
  [["Hinterer Halsschildteil des Weibchens doppelt so lang wie der vordere", "A:rudolfae"], ["Hinterer Halsschildteil des Weibchens kürzer", "A:andreinii"]],
  [["Deckflügel der Männchen mehr als 3-mal, der Weibchen mehr als 2-mal so lang wie der Halsschild", "A:centralis"], ["Deckflügel der Männchen weniger als 3-mal, der Weibchen weniger als 2-mal so lang wie der Halsschild", "A:citernii"]],
] };

FIX[11428] = { gen: "Litaneutria", c: [
  [["Augen mehr oder weniger spitz; Deckflügel der Männchen lang", 2], ["Augen gerundet; Deckflügel der Männchen kurz", "A:skinneri"]],
  [["Vorderrandfeld der Deckflügel beim Männchen grau", 3], ["Vorderrandfeld der Deckflügel beim Männchen grün", "A:ocularis"]],
  [["Hinterflügel der Männchen mit rauchigem Fleck an der Basis", 4], ["Hinterflügel der Männchen gleichmäßig rauchig", "A:pacifica"]],
  [["Hinterflügel der Männchen stärker rauchig", "A:obscura"], ["Hinterflügel der Männchen schwächer rauchig", 5]],
  [["Halsschild weniger schlank", "A:minor"], ["Halsschild schlanker", "A:borealis"]],
] };
FIX[6077] = { gen: "Theopompella", c: [
  [["Hinterer Halsschildteil fast glatt, ohne erhabene kegelförmige Höcker", 2], ["Hinterer Halsschildteil hinter der Querfurche mit 2 kegelförmigen Höckern", 3]],
  [["Vorderhüften innen an der Basis mit schmaler schwarzer Binde", "A:heterochroa"], ["Vorderhüften ohne schwarze Binde", "A:westwoodi"]],
  [["Vorderhüften innen ohne schwarze Binden", "A:pallida"], ["Vorderhüften innen mit 1 oder 2 schwarzen Binden", 4]],
  [["Vorderhüften nur mit einer schwarzen Binde an der Basis", "A:fusca"], ["Vorderhüften mit 2 schwarzen Binden", 5]],
  [["Vorderschenkelringe innen gelb, nur die Spitze schwarz", "A:aurivillii"], ["Vorderschenkelringe innen fast ganz schwarz, nur ganz an der Basis gelb", "A:orientalis"]],
] };
FIX[36974] = { gen: "Aethalochroa", c: [
  [["Hinterschenkel am Ende mit Lappen", 2], ["Hinterschenkel ohne Lappen", 4]],
  [["Augen unbewehrt", 3], ["Augen mit einem Dorn", "A:affinis"]],
  [["Kleiner; Lappen der Mittel- und Hinterschenkel kleiner", "A:ashmoliana"], ["Größer; Lappen der Mittel- und Hinterschenkel größer", "A:insignis"]],
  [["Mittel- und Hinterschenkel an den Unterkanten bedornt", "A:spinipes"], ["Mittel- und Hinterschenkel ohne Dornen", "A:simplicipes"]],
] };
FIX[32307] = { gen: "Anasigerpes", c: [
  [["Bräunlich", "A:crassipes"], ["Grün", 2]],
  [["Vorderschenkel innen fast ganz schwarz", "A:heydeni"], ["Vorderschenkel innen fast ganz gelb", 3]],
  [["Vorderhüften innen mit schwarzen Querbinden", 4], ["Vorderhüften ohne Binden", 5]],
  [["Vorderhüften mit 2 Binden", "A:bifasciata"], ["Vorderhüften mit 3 Binden", "A:trifasciata"]],
  [["Spitzenwinkel der Hinterflügel etwas ausgezogen", "A:alluaudi"], ["Spitzenwinkel der Hinterflügel nicht ausgezogen", "A:modesta"]],
] };

FIX[15754] = { gen: "Leptocola", c: [
  [["Vorderschenkel innen entlang der Unterkante schwarz; Mittel- und Hinterbeine gelb geringelt", 2], ["Vorderschenkel innen nicht schwarz oder nur um die Klauenfurche schwarz gefleckt; Beine nicht gelb geringelt", 3]],
  [["Größer; Vorderbrust ungefleckt", "A:stanleyana"], ["Kleiner; Vorderbrust mit 8–9 runden Flecken in einer Reihe entlang der Mitte", "A:seriepunctata"]],
  [["Halsschild viel länger als der übrige Körper", "A:gracillima"], ["Halsschild kürzer als der übrige Körper", 4]],
  [["Vorderbrust ohne schwarze Punkte", "A:phthisica"], ["Vorderbrust schwarz punktiert", "A:fragilis"]],
] };
FIX[28213] = { gen: "Camelomantis", c: [
  [["Ränder des hinteren Halsschildteils bei beiden Geschlechtern glatt", "A:giraffa"], ["Ränder zumindest beim Weibchen gekerbt", 2]],
  [["Zähnchen am Rand des hinteren Halsschildteils schwarz", "A:moultoni"], ["Zähnchen gleichfarbig", 3]],
  [["Vorderhüften mit vielen (15–18) spitzen Zähnchen", "A:sumatrana"], ["Vorderhüften mit weniger (bis 10), etwas stumpfen Zähnchen", 4]],
  [["Vorderhüften mit 6–7 Zähnchen", "A:gracillima"], ["Vorderhüften mit 9–10 Zähnchen", "A:penangica"]],
] };
FIX[4389] = { gen: "Chaeteessa", c: [
  [["Cerci so lang wie der Hinterleib", "A:filata"], ["Cerci kürzer als der Hinterleib", 2]],
  [["Cerci länger als der halbe Hinterleib", "A:caudata"], ["Cerci kürzer als der halbe Hinterleib", "A:valida"]],
] };
FIX[36606] = { gen: "Zoolea", c: [
  [["Mittel- und Seitenlappen der Bauchsegmente spitz", 2], ["Lappen der Bauchsegmente gerundet", 3]],
  [["Fortsätze der Punktaugenhöcker länger als die Vorderschienen", "A:gigas"], ["Fortsätze fast so lang wie die Vorderschienen", "A:lobipes"]],
  [["Halsschild mindestens doppelt so lang wie die Vorderhüften", 4], ["Halsschild weniger als doppelt so lang wie die Vorderhüften", "A:minor"]],
  [["Fortsätze der Punktaugenhöcker so lang wie die Vorderhüften", "A:major"], ["Fortsätze kürzer als die Vorderhüften", "A:orba|A:guerinii"]],
] };
FIX[36002] = { gen: "Phyllovates", c: [
  [["Punktaugenhöcker berühren sich", 2], ["Punktaugenhöcker weit getrennt", 5]],
  [["Fortsätze der Punktaugenhöcker lang", 3], ["Fortsätze der Punktaugenhöcker sehr kurz", "A:brevicornis"]],
  [["Hinterer Halsschildteil weniger als doppelt so lang wie die Vorderhüften", 4], ["Hinterer Halsschildteil doppelt so lang wie die Vorderhüften", "A:cornuta"]],
  [["Fortsätze spitz; Endlappen der Hinterschenkel spitz", "A:chlorophaea"], ["Fortsätze gerundet; äußerer Endlappen der Hinterschenkel abgestutzt", "A:maya"]],
  [["Vorderrandfeld der Deckflügel beim Weibchen zur Spitze plötzlich verschmälert", "A:cingulata"], ["Vorderrandfeld allmählich verschmälert", 6]],
  [["Halsschildränder fein gezähnelt", "A:tripunctata"], ["Halsschildränder kräftig gezähnt", 7]],
  [["Mittel- und Hinterschienen zwischen Basis und Mitte etwas lappig verbreitert", 8], ["Mittel- und Hinterschienen nicht verbreitert", 9]],
  [["Deckflügel spitz", "A:parallela"], ["Deckflügel mit stumpfer Spitze", "A:minor"]],
  [["Zähne am Halsschild kleiner", "A:parvula"], ["Zähne am Halsschild kräftiger", "A:spinicollis"]],
] };

FIX[23692] = { gen: "Auromantis", c: [
  [["Hinterbeine der Männchen nicht braun geringelt", 2], ["Hinterbeine der Männchen braun geringelt", "A:cinctipes"]],
  [["Flügelmal der Deckflügel groß, schwarz", "A:androgyna"], ["Flügelmal gleichfarbig", 3]],
  [["Vorderschenkel sehr schlank", "A:gracilipes"], ["Vorderschenkel kräftig", 4]],
  [["Hinterflügel der Männchen glasklar; Vorderrandfeld der Deckflügel beim Weibchen so breit wie das halbe Mittelfeld", "A:montana"], ["Hinterflügel der Männchen in der hinteren Hälfte des Analfelds leicht rauchig; Vorderrandfeld beim Weibchen schmaler als das halbe Mittelfeld", "A:limbata"]],
] };
FIX[34026] = { gen: "Euthyphleps", c: [
  [["Mittel- und Hinterschenkel oben mit kleinem Lappen", "A:rectivenis"], ["Mittel- und Hinterschenkel oben ohne Lappen", "A:curtipes"]],
] };

FIX[20880] = { gen: "Choeradodis", c: [
  [["Vorderschenkel ungefleckt", "A:strumaria"], ["Vorderschenkel innen mit schwarzem Fleck", 2]],
  [["Fleck in der unteren Hälfte des Vorderschenkels", 3], ["Fleck in der oberen Hälfte des Vorderschenkels", 8]],
  [["Vorderhüften mit 8–12 langen Dornen", 4], ["Vorderhüften mit vielen kleinen Dornen", 6]],
  [["Flügelmal am Hinterende mit schwarzem Punkt", 5], ["Flügelmal ohne schwarzen Punkt", "A:stalii"]],
  [["Erstes Glied der Vorderfüße innen schwarz", "A:laticollis"], ["Erstes Glied der Vorderfüße nicht oder kaum gebräunt", "A:rhomboidea"]],
  [["Der schwarze Fleck reicht nach hinten über die Klauenfurche hinaus", "A:rhombicollis"], ["Der Fleck reicht nicht über den 1. Scheibendorn hinaus", 7]],
  [["Fleck reicht bis zum 1. Scheibendorn", "A:servillei"], ["Fleck reicht nicht über die Klauenfurche hinaus", "A:brunneri"]],
  [["Schwarzer Fleck schmal, erreicht die Klauenfurche nicht", "A:cancellata"], ["Schwarzer Fleck reicht bis zum Oberrand der Klauenfurche", "A:squilla"]],
] };
FIX[12431] = { gen: "Ligariella", c: [
  [["Deckflügel der Männchen dicht schwarz punktiert; Weibchen grau", "A:trigonalis"], ["Deckflügel der Männchen kaum oder nicht punktiert", 2]],
  [["Deckflügel der Männchen mit einigen kleinen braunen Punkten", "A:umtalica"], ["Deckflügel der Männchen ohne braune Punkte", 3]],
  [["Oberkante des Vorderschenkels gezähnelt", "A:dentata"], ["Oberkante des Vorderschenkels fast glatt", 4]],
  [["Sehr blass gelbbraun", 5], ["Ockergelb", "A:bolivarii"]],
  [["Diskoidalader der Hinterflügel weiß", "A:damarae"], ["Diskoidalader der Hinterflügel gelbbraun", "A:australis"]],
] };
FIX[17112] = { gen: "Bactromantis", c: [
  [["Ende der Hinterschenkel schwärzlich", "A:virga"], ["Ende der Hinterschenkel wie der übrige Schenkel gefärbt", 2]],
  [["Deckflügel der Männchen kaum doppelt so lang wie der Halsschild", "A:mexicana"], ["Deckflügel der Männchen mehr als doppelt so lang wie der Halsschild", "A:tolteca"]],
] };
FIX[16574] = { gen: "Bantiella", c: [
  [["Vorderschenkel gelbbraun", 2], ["Vorderschenkel mehr oder weniger schwärzlich", 3]],
  [["Hinterfüße an der Spitze schwärzlich", "A:trinitatis"], ["Hinterfüße an der Spitze gelbbraun", "A:pallida"]],
  [["Deckflügel der Männchen rauchig", "A:fusca"], ["Deckflügel der Männchen gräulich gelbbraun", "A:columbina"]],
] };

FIX[26566] = { gen: "Hierodula", c: [
  [["Halsschild-Verbreiterung reicht nicht bis zur Halsschildbasis (Hierodula im engeren Sinn)", 2], ["Halsschild-Verbreiterung reicht bis zur Halsschildbasis (heute meist Rhombodera)", 40]],
  [["Vorderhüften einfarbig", 3], ["Vorderhüften innen zumindest teilweise schwarz", 38]],
  [["Dornen der Vorderhüften kleiner, an der Basis nicht verdickt, direkt am Rand entspringend", 4], ["Dornen der Vorderhüften kräftiger, innen an der Basis verdickt, aus einer Furche vor dem Rand entspringend", 25]],
  [["Vorderhüften innen mit glatten Schwielenflecken an der Basis einiger Dornen", "A:trimacula"], ["Vorderhüften ohne Schwielenflecken", 5]],
  [["Hinterer Halsschildteil beim Männchen 3-mal, beim Weibchen mindestens 2½-mal so lang wie der vordere", 6], ["Hinterer Halsschildteil kürzer", 23]],
  [["Vorderschenkel innen mit schwarzem Fleck von der Basis bis zur Klauenfurche", "A:rajah"], ["Vorderschenkel ohne schwarzen Fleck zwischen Basis und Klauenfurche", 7]],
  [["Vorderschenkel vor der Klauenfurche mit dreieckigem schwarzem Fleck", "A:togiana"], ["Vorderschenkel ohne diesen Fleck", 8]],
  [["Klein: Halsschild 14 mm lang", "A:malaya"], ["Größer: Halsschild länger", 9]],
  [["Vorderschenkel innen nahe der Basis mit kleinem schwarzem Fleck", 10], ["Vorderschenkel ohne diesen Fleck", 11]],
  [["Ende der Vorderschenkelringe schwarz", "A:formosana"], ["Ende der Vorderschenkelringe nicht schwarz", "A:stigmata"]],
  [["Große Innendornen des Vorderschenkels nur an der Spitze schwarz", 12], ["Große Innendornen innen ganz schwarz oder schwärzlich", 15]],
  [["Die ersten 3 Scheibendornen nur an der Spitze schwarz", 13], ["1. und 3. Scheibendorn innen ganz schwarz", 14]],
  [["Hinterflügel glasklar", "A:membranacea"], ["Hinterflügel rauchig", "A:fuscescens"]],
  [["Deckflügel der Weibchen oval, breit, kaum doppelt so lang wie breit, Mittelfeld undurchsichtig", "A:striata"], ["Deckflügel der Weibchen länglich, schmaler, mehr als 3-mal so lang wie breit, Mittelfeld glasklar", "A:cuchingina"]],
  [["Ende der Vorderschenkelringe schwarz", 16], ["Ende der Vorderschenkelringe nicht schwarz", 18]],
  [["Dornen der Vorderhüften sehr dicht, zur Spitze länger; Deckflügel der Weibchen oval, kaum doppelt so lang wie breit", "A:gracilicollis"], ["Dornen der Vorderhüften weit stehend, zur Spitze nicht länger; Deckflügel mindestens 3-mal so lang wie breit", 17]],
  [["Größer; Deckflügel der Männchen mehr als doppelt so lang wie der Halsschild", "A:grandis"], ["Kleiner; Deckflügel der Männchen weniger als doppelt so lang wie der Halsschild", "A:siporana"]],
  [["Mittelbrust mit zwei schwarzen Punkten", "A:perakana"], ["Mittelbrust ohne schwarze Punkte", 19]],
  [["Seitenränder des hinteren Halsschildteils nahe der Basis schwarz gesäumt", "A:daphne"], ["Seitenränder einfarbig", 20]],
  [["Vorderhüften mit 15–20 Dornen", "A:multispinulosa"], ["Vorderhüften mit 5–10 Dornen", 21]],
  [["Vorderhüften mit 8–9 Dornen", "A:ventralis"], ["Vorderhüften mit 5–6 Dornen", 22]],
  [["Deckflügel länger; Mittelfeld der Deckflügel beim Weibchen glasklar", "A:vitrea"], ["Deckflügel kürzer; Mittelfeld beim Weibchen fast undurchsichtig", "A:vitreoides"]],
  [["Dornen der Vorderhüften lang und kräftig", "A:harpyia"], ["Dornen der Vorderhüften klein", 24]],
  [["Scheibendornen und große Innendornen des Vorderschenkels nur mit schwarzer Spitze", "A:tenuidentata"], ["Scheibendornen und große Innendornen innen schwarz", "A:transcaucasica"]],
  [["Vorderhüften ohne warzige Platten", 26], ["Vorderhüften an der Basis einiger Dornen mit warzigen Platten", 35]],
  [["Vorderschenkel innen mit schwarzem Fleck", "A:everetti"], ["Vorderschenkel innen ohne schwarzen Fleck", 27]],
  [["Die ersten 3 Scheibendornen mit schwarzer Spitze", 28], ["Die ersten 3 Scheibendornen innen ganz schwarz", 31]],
  [["Vorderhüften mit 5–6 Dornen", 29], ["Vorderhüften mit 8–9 längeren Dornen", 30]],
  [["Halsschild schlanker; Deckflügel der Weibchen viel länger als der Hinterleib", "A:unimaculata"], ["Halsschild breiter; Deckflügel der Weibchen kaum so lang wie der Hinterleib", "A:laevicollis"]],
  [["Halsschildränder der Männchen glatt", "A:modesta"], ["Halsschildränder der Männchen gezähnt", "A:tenuis"]],
  [["Halsschild schlank und lang; hinterer Teil mehr als 3-mal so lang wie der vordere", "A:dyaka"], ["Halsschild weniger schlank und kürzer", 32]],
  [["Erstes Glied der Vorderfüße innen schwarz", "A:ralumina"], ["Erstes Glied der Vorderfüße nur an der Spitze schwarz", 33]],
  [["Vorderhüften mit 7–9 verdickten Zähnen", 34], ["Vorderhüften mit 4–5 verdickten Zähnen", "A:bhamoana"]],
  [["Dornen der Vorderhüften sehr dick; Vorderschenkel ungefleckt", "A:latipennis"], ["Dornen der Vorderhüften klein; Vorderschenkel am Grund der großen Innendornen mit rötlichen Flecken", "A:dubia"]],
  [["Vorderhüften mit 4 warzigen Flecken", 36], ["Vorderhüften mit 2–3 warzigen Flecken", "A:bipapilla"]],
  [["Vorderbrust ohne schwarze Binden", "A:saussurei"], ["Vorderbrust mit 2 schwarzen Binden", 37]],
  [["Vorderschenkel innen ohne schwarzen Fleck", "A:patellifera"], ["Vorderschenkel innen mit schwarzem Fleck", "A:manillana"]],
  [["Vorderhüften innen ganz schwarz", "A:parviceps"], ["Vorderhüften nur an der Spitze schwarz", 39]],
  [["Vorderschenkel vor der Klauenfurche mit dreieckigem schwarzem Fleck", "A:pulchra"], ["Vorderschenkel ohne diesen Fleck", "A:purpurescens"]],
  [["Hinterer Halsschildteil mindestens 2½-mal so lang wie der vordere", 41], ["Hinterer Halsschildteil kürzer", 53]],
  [["Breiteste Stelle des Halsschilds vor der Mitte", 42], ["Breiteste Stelle des Halsschilds in der Mitte", 48]],
  [["Große Innendornen des Vorderschenkels schwarz", 43], ["Große Innendornen nur an der Spitze schwarz", 47]],
  [["Flügelmal an beiden Enden schwarz gesäumt", "A:megaera"], ["Flügelmal nicht schwarz gesäumt", 44]],
  [["Ende der Vorderschenkelringe schwarz", 45], ["Ende der Vorderschenkelringe nicht schwarz", 46]],
  [["Vorderschenkel vor der Klauenfurche mit schwarzem Fleck", "A:taprobanae"], ["Vorderschenkel ohne schwarzen Fleck", "A:laticollis"]],
  [["Die ersten 3 Scheibendornen innen ganz schwarz", "A:titania"], ["Die ersten 3 Scheibendornen nur mit schwarzer Spitze", "A:keiana"]],
  [["Deckflügel der Weibchen weniger als doppelt so lang wie der Halsschild", "A:flava"], ["Deckflügel der Weibchen doppelt so lang wie der Halsschild", "A:ungulata"]],
  [["Halsschild der Männchen doppelt so lang wie breit", "A:fratricida"], ["Halsschild der Männchen weniger als doppelt so lang wie breit", 49]],
  [["Ende der Vorderschenkelringe schwarz", "A:stalii"], ["Ende der Vorderschenkelringe nicht schwarz", 50]],
  [["Hinterer Halsschildteil länger, als die Verbreiterung breit ist", 51], ["Hinterer Halsschildteil beim Männchen kaum so lang, beim Weibchen kürzer, als die Verbreiterung breit ist", "A:rotunda"]],
  [["Halsschild weniger als 1½-mal so breit wie der Kopf", "A:javana"], ["Halsschild 1½-mal so breit wie der Kopf", 52]],
  [["Halsschild weniger breit; erster Ast der Ulnarader zwei- oder dreiästig", "A:basalis"], ["Halsschild breiter; erster Ast der Ulnarader vierästig", "A:valida"]],
  [["Vorderschenkel einfarbig, ohne bräunliche Binden", 54], ["Vorderschenkel außen mit 3 bräunlichen Querbinden", "A:butteri"]],
  [["Halsschild-Verbreiterung schwach; große Innendornen schwarz", "A:crassa"], ["Halsschild-Verbreiterung breit, blattartig; große Innendornen nur mit schwarzer Spitze", "A:tectiformis"]],
] };

Object.assign(ALIAS, {
  Anaxarchae: "G:Anaxarcha", Galinthiades: "G:Galinthias", Phyllothelides: "SYN:31965", Ambiviae: "SYN:31861", Acromantes: "SYN:31410",
  Hestiasulae: "SYN:32658", Otomantes: "SYN:32907", Pseudocreobotrae: "SYN:33627", Hymenopoda: "SYN:33220", Euantissae: "SYN:32488", Panurgicae: "SYN:33049",
  Stenophyllae: "G:Stenophylla", Paradanuriae: "SYN:33941", Toxoderae: "SYN:34138", Loxomantes: "G:Loxomantis", Calamothespes: "SYN:34410",
  Cardiopterae: "G:Cardioptera", Ceratocraniae: "G:Ceratocrania", Aethalochroae: "G:Aethalochroa", Heterochaetae: "SYN:36758", Vates: "SYN:35968", Oxyopsides: "SYN:34661", Stagmatopterae: "SYN:35197", Danuriae: "SYN:37099", Popae: "SYN:37517",
  Empusae: "SYN:37732", Blepharodes: "SYN:38355", Idola: "G:Idolum",
});

module.exports = { FIX, ALIAS };
