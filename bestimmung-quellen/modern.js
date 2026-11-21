// Moderne Bestimmungsschlüssel aus Revisionen (selbst übertragen). Ziel: Zahl = Paar, "A:epitheton" (Anfang genügt).
"use strict";
const M = [];
M.push({ gen: "Rhodomantis", q: "Milledge, G. A. (2014): A revision of Rhodomantis Giglio-Tos, 1917. Zootaxa 3797: 1–xx.", t: "Milledge 2014", c: [
  [["Flügel zu winzigen Läppchen verkürzt", "A:micropt"], ["Flügel reichen mindestens bis zum Hinterrand des 1. Hinterleibsrings", 2]],
  [["Flügel reichen nur bis zum Hinterrand des 1. Hinterleibsrings", "A:rentzi"], ["Flügel reichen deutlich darüber hinaus", 3]],
  [["Hinterflügel der Männchen zur Spitze des Mittelfelds mit schwärzlichem Fleck; Weibchen: Hinterrand des 6. Bauchsegments verlängert", "A:macula"], ["Hinterflügel der Männchen ohne schwärzlichen Fleck; Weibchen: 6. Bauchsegment normal", 4]],
  [["(Nur Männchen) Rückenfortsatz des ventralen Phallomers (Genital) in einen einzelnen Dorn ausgezogen", 5], ["Rückenfortsatz des ventralen Phallomers anders", 6]],
  [["Phalloid-Apophyse (Genital) kurz und stumpf", "A:pulchella"], ["Phalloid-Apophyse (Genital) lang und dornförmig", "A:mitchell"]],
  [["Rückenfortsatz des ventralen Phallomers (Genital) abgestutzt, mit zwei kräftigen Zähnen", 7], ["Rückenfortsatz des ventralen Phallomers anders", 8]],
  [["Phalloid-Apophyse (Genital) lang, hakenförmig; Mittellappen des ventralen Phallomers gerundet", "A:kimberley"], ["Phalloid-Apophyse verkürzt; Mittellappen des ventralen Phallomers spitz", "A:napier"]],
  [["Rückenfortsatz des ventralen Phallomers (Genital) vor der Spitze verengt, mit vorderen und hinteren Vorsprüngen", "A:queenslandica"], ["Rückenfortsatz nicht verengt, mit schwachem hinterem Vorsprung und gesägtem Vorderrand", "A:helenae"]],
] });

M.push({ gen: "Stagmomantis", q: "Anderson, K. (2020): Revision of Stagmomantis Saussure, 1869. Soothsayer 1(1). (Untergattungsschlüssel der Weibchen; Arten je Untergattung)", t: "Anderson 2020", c: [
  [["Vorderrand der Vorderhüften unbewehrt oder nur fein gezähnt; Halsschildränder glatt bis gezähnelt", 2], ["Vorderrand der Vorderhüften mit dicken, dreieckigen Zähnen; Halsschildränder gesägt (Untergattung Stauromantis)", "A:theophila|A:pagana"]],
  [["Hinterleibsrücken einfarbig bis gesprenkelt, ohne dunkle Binden", 3], ["Hinterleibsringe 3–4 hinten breit schwarzbraun gesäumt (Untergattung Nigralora; S. californica gilt als Synonym von S. wheelerii)", "A:colorata|A:californica"]],
  [["Halsschild vor der Verbreiterung eingeschnürt; vorderer Teil hinter der Verbreiterung plötzlich verschmälert", 4], ["Halsschildränder vor der Verbreiterung fast parallel; vorderer Teil allmählich nach vorn verschmälert (Untergattung Parviletum)", "A:fraterna"]],
  [["Deckflügel (Weibchen) reichen über den 3. Hinterleibsring hinaus", 6], ["Deckflügel (Weibchen) erreichen das Ende des 3. Hinterleibsrings nicht", 5]],
  [["Groß, lang und schlank; nur in Florida (Untergattung Longicorpus)", "A:floridensis"], ["Klein und gedrungen; tropisches Mexiko bis Mittelamerika (Untergattung Oromantis)", "A:nahua|A:vicina"]],
  [["Körper lang und schlank", 7], ["Körper gedrungen und kräftig", 8]],
  [["Halsschild vor der Verbreiterung eingeschnürt; Hinterleib stark spindelförmig, in der Mitte breit; Mittelamerika (Untergattung Uromantis)", "A:centralis|A:heterogamia|A:parvidentata|A:venusta"], ["Halsschildränder vor der Verbreiterung fast parallel; Hinterleib nur schwach spindelförmig; Arizona und Nordmexiko (Untergattung Tenuecedes)", "A:gracilipes"]],
  [["Vorderrandfeld der Deckflügel breit, mindestens ein Drittel so breit wie das Mittelfeld (Untergattung Auromantis)", "A:limbata|A:montana"], ["Vorderrandfeld der Deckflügel schmal, viel schmaler als ein Drittel des Mittelfelds (Untergattung Stagmomantis)", "A:carolina|A:coerulans|A:conspurcata|A:hebardi"]],
] });

M.push({ gen: "Toxodera", q: "Roy, R. (2009): Révision des Toxoderini sensu novo (Mantodea, Toxoderinae). Revue suisse de Zoologie 116: 93–183.", t: "Roy 2009", c: [
  [["Blattlappen der Mittel- und Hinterschenkel schmal, mit gleichmäßig gebogenen Rändern", "A:integrifolia"], ["Blattlappen der Mittel- und Hinterschenkel breit, mit unregelmäßigen Rändern", 2]],
  [["Blattlappen der Mittel- und Hinterschenkel gezähnt oder zerfranst", 3], ["Blattlappen der Mittel- und Hinterschenkel gewellt oder gelappt", 4]],
  [["Endfortsatz der Mittel- und Hinterschenkel nicht doppelt so lang wie die Seitenfortsätze; Blattlappen schmal mit spitzen Zähnen; Vorderschiene außen mit 12–19 Dornen; kleiner", "A:fimbriata"], ["Endfortsatz mehr als doppelt so lang wie die Seitenfortsätze; Blattlappen ziemlich breit mit kurzen Zähnen; Vorderschiene außen mit 11–15 Dornen; größer", "A:hauseri"]],
  [["Augen mit kurzer Spitze; Lappen der Mittel- und Hinterschenkel unregelmäßig gewellt; ziemlich groß", 5], ["Augen mit langer Spitze; Lappen der Mittel- und Hinterschenkel zweilappig; sehr groß", 6]],
  [["Endfortsatz der Mittel- und Hinterschenkel nach vorn gebogen; Blattlappen im Enddrittel am breitesten; Augenspitze dünn; Mittellappen des 5. Hinterleibsrings sehr zerfranst", "A:maculata"], ["Endfortsatz nicht nach vorn gebogen; Blattlappen in der Mitte am breitesten; Augenspitze kräftig; Mittellappen des 5. Hinterleibsrings unregelmäßig gezähnt", "A:pfanneri"]],
  [["Mittellappen des 5. Hinterleibsrings hell, Spitze sichelförmig nach hinten gebogen; Mittelfeld der Deckflügel stark braun gefleckt; letztes Cercusglied kaum eingekerbt", "A:beieri"], ["Mittellappen des 5. Hinterleibsrings dunkel, schmal zugespitzt und nach vorn gebogen; Deckflügel wenig gefleckt; letztes Cercusglied stark eingekerbt", 7]],
  [["Stirnschild mit mäßig vorstehendem, zweilappigem Oberrand; Augen in einen deutlichen Dorn ausgezogen; Lappen der Mittel- und Hinterschenkel deutlich getrennt; kleiner", "A:denticulata"], ["Stirnschild oben schmal und hoch, dreilappig (Mittellappen am breitesten); Augenspitze kurz und dick; Schenkellappen breit verbunden; sehr groß", "A:maxima"]],
] });
M.push({ gen: "Paratoxodera", q: "Roy, R. (2009): Révision des Toxoderini sensu novo (Mantodea, Toxoderinae). Revue suisse de Zoologie 116: 93–183.", t: "Roy 2009", c: [
  [["Halsschild am Hinterrand mit großer, dreieckiger Blattverbreiterung, viel größer als die Mittellappen des hinteren Halsschildteils", "A:meggitti"], ["Verbreiterung am Hinterrand etwa so groß wie die Mittellappen oder kleiner", 2]],
  [["Mittellappen des 5. Hinterleibsrings am Ende sehr breit; Mittellappen der Bauchsegmente 3–4 und des Halsschilds stark entwickelt", "A:gigliotosi"], ["Mittellappen des 5. Hinterleibsrings schmal; übrige Mittellappen mehr oder weniger verkleinert", 3]],
  [["Blattlappen der Mittel- und Hinterschenkel am Hinterrand nur leicht gewellt", "A:marshallae"], ["Blattlappen am Hinterrand ebenso eingekerbt wie am Vorderrand", 4]],
  [["Mittellappen des Halsschilds nach vorn gerichtet, der zweite verkleinert oder fehlend; Vorderschiene innen mit etwa 30 Dornen", "A:cornicollis"], ["Mittellappen des Halsschilds an der Basis breit, in kleine Spitzen auslaufend; Vorderschiene innen mit oft mehr als 40 Dornen", "A:polyacantha"]],
] });

M.push({ gen: "Litaneutria", q: "Anderson, K. (2021): Revision of the Nearctic Genus Litaneutria. (Schlüssel der Männchen)", t: "Anderson 2021", c: [
  [["(Männchen) Scheitelmitte auf Höhe der Augenoberkante oder darüber gewölbt", 2], ["(Männchen) Scheitelmitte tiefer als die Augenoberkante", 3]],
  [["Halsschild schlank (Länge : Breite über den Hüften etwa 2,5); kurz- und langflügelige Tiere kommen zusammen vor", "A:skinneri"], ["Halsschild gedrungener (etwa 2,1); nur kurzflügelig", "A:baccina"]],
  [["Augen oben stumpf kegelförmig", 4], ["Augen oben abgestutzt bis gerundet", 6]],
  [["Halsschild über den Hüften schwach bis mäßig verbreitert; hinterer Teil mit parallelen Rändern", 5], ["Halsschild über den Hüften stark verbreitert; hinterer Teil eingeschnürt", "A:chaparrali"]],
  [["Fleck im Hinterflügel hellbraun; nur im Tal des Rio Grande (Südtexas)", "A:emarginata"], ["Fleck im Hinterflügel schwarz; nur in der Küstenebene von Sinaloa (Mexiko)", "A:littoralis"]],
  [["Kurzflügelig (Flügel verkürzt wie beim Weibchen)", 12], ["Langflügelig", 7]],
  [["Analfeld der Hinterflügel hell bis sehr dunkel gefleckt, Fleck immer vorhanden; Gebirge, Trockengebiete und Grasland östlich bis nördlich der Sierra Nevada", 8], ["Analfeld der Hinterflügel schwach gefleckt, Fleck schwach oder fehlend; nur im mediterranen Kalifornien", "A:pacifica"]],
  [["Hinterflügel hell bis mäßig bräunlich gefleckt, Fleck deutlich abgesetzt", 9], ["Hinterflügel meist stark dunkelbraun bis schwärzlich gefleckt, Fleck kaum abgesetzt", "A:obscura"]],
  [["Halsschild gedrungener (Länge : Breite über den Hüften unter 2,36); Hochgebirge", 10], ["Halsschild schlanker (über 2,36); Trockengebiete und Grasland in tiefen Lagen", 11]],
  [["Hinterflügel kurz und schmal; nur Columbia-Plateau, Blue Mountains und Okanogan-Plateau", "A:superna"], ["Hinterflügel lang und schmal; nur Colorado-Plateau und südliche Rocky Mountains", "A:scopulosa"]],
  [["Augen schmal eiförmig, etwas abgestutzt; nur Chihuahua-Wüste und Great Plains", "A:minor"], ["Sonora-Wüste und Niederkalifornien", "A:ocularis"]],
  [["Hinterer Halsschildteil kürzer (Länge : kleinste Breite unter 3,65); östlich oder nördlich der Sierra Nevada", 13], ["Hinterer Halsschildteil länger (über 3,65); westlich der Sierra Nevada", "A:pacifica"]],
  [["Halsschild kurz und kräftig; Trockengebiete im Hochland westlich oder innerhalb der Rocky Mountains", 14], ["Halsschild länger; nur Chihuahua-Wüste und Great Plains", "A:minor"]],
  [["Augen deutlich gerundet; südlich bis südöstlich der Kaskaden", 15], ["Augen schmal eiförmig; nur Columbia-Plateau, Blue Mountains und Okanogan-Plateau", "A:superna"]],
  [["Nur Colorado-Plateau und südliche Rocky Mountains", "A:scopulosa"], ["Nur Mojave-Wüste", "A:obscura"]],
] });

M.push({ gen: "Thespis", q: "Anderson, K. (2022): Dr. Fothergill's little gray American mantis: Taxonomic Revision of Thespis Serville, 1831. (Schlüssel der Männchen)", t: "Anderson 2022", c: [
  [["(Männchen) Halsschild kurz, fast rautenförmig; Vorderrandfeld der Deckflügel fast undurchsichtig", "A:tessellat"], ["Halsschild lang, strichförmig; Vorderrandfeld der Deckflügel glasklar", 2]],
  [["Afterdeckplatte lang dreieckig, spitz, erreicht das letzte Glied der Griffel oder ragt darüber; südliche USA und Nordmexiko", "A:parva"], ["Afterdeckplatte breit dreieckig, kürzer als die Griffel, Spitze gerundet; tropisches Mexiko und Mittelamerika", 3]],
  [["Längsadern der Deckflügel weit auseinander, mäßig gebogen; Queräderchen glasklar; Küste Westmexikos", "A:punctulat"], ["Längsadern dicht beieinander, fast gerade; Queräderchen weißlich, am Ansatz braunschwarz; Südmexiko und Mittelamerika", "A:striolat"]],
] });
M.push({ gen: "Musonia", q: "Anderson, K. (2026): Taxonomic Revision of Musonia Stål, 1877 (Mantodea: Thespidae). (Schlüssel der Weibchen)", t: "Anderson 2026", c: [
  [["(Weibchen) Hinterer Halsschildteil höchstens 1,8-mal so lang wie der vordere", 2], ["Hinterer Halsschildteil mindestens 2-mal so lang wie der vordere", 3]],
  [["Nur auf Aruba", "A:compacta"], ["Chile, Ecuador und Peru", "A:margharethae"]],
  [["Hinterer Halsschildteil 2,3-mal so lang wie der vordere; Afterdeckplatte kaum länger als breit", "A:remota"], ["Hinterer Halsschildteil höchstens 2,2-mal so lang; Afterdeckplatte mindestens 1,4-mal so lang wie breit", 4]],
  [["Panama und Costa Rica nördlich der Talamanca-Kordillere", "A:femorata"], ["Panama und Costa Rica südlich der Talamanca-Kordillere und weiter südlich", 5]],
  [["Afterdeckplatte deutlich länger (1,6-mal so lang wie breit); Westseite der Westkordillere, Chocó–Darién und Pazifikküste Mittelamerikas", "A:chocoensis"], ["Afterdeckplatte kürzer (1,4-mal so lang wie breit); Ostseite der Westkordillere, Amazonastiefland, Guayana-Schild, südliche Kleine Antillen", "A:surinama"]],
] });
M.push({ gen: "Gonatista", q: "Anderson, K. (2025): Taxonomic Revision of Genus Gonatista Saussure, 1869. (Schlüssel der Weibchen; Weibchen von G. jaiba und G. phryganoides unbekannt)", t: "Anderson 2025", c: [
  [["(Weibchen) Halsschild lang und schmal; Hispaniola, Puerto Rico, Jungferninseln", 2], ["Halsschild kurz und kräftig; Bahamas, Kuba, Jamaika und Südosten der USA", "A:bifasciata"]],
  [["Mittelgroß (40–47 mm); Endlappen der Vorderhüften einfarbig", 3], ["Groß (49–53 mm); Endlappen der Vorderhüften geschwärzt", "A:major"]],
  [["Vorderseite der Vorderhüften rotviolett mit verstreuten weißlichen Knötchen; Puerto Rico und Jungferninseln", "A:borinquensis"], ["Vorderseite der Vorderhüften rotbraun, glatt; Hispaniola", "A:quisqueyana"]],
] });

M.push({ gen: "Holaptilon", q: "Kolnegari, M. et al. (2024): The Six Dwarfs of the Middle East: revision of the praying mantis genus Holaptilon. Zenodo 10842147.", t: "Kolnegari et al. 2024", c: [
  [["Vorderschenkel mit 5 hinteren Unterranddornen; Südiran", "A:abdullahii"], ["Vorderschenkel mit 4 hinteren Unterranddornen", 2]],
  [["Kopf im Verhältnis zum Halsschild höher (Verhältniszahl unter 0,6)", 3], ["Verhältniszahl über 0,6", 5]],
  [["Nur Israel und Jordanien", "A:pusillulum"], ["Nur Südiran", 4]],
  [["(Männchen, Genital) Fortsatz kurz, fingerförmig, zur Spitze stark verschmälert und oft gebogen", "A:iranicum"], ["(Männchen, Genital) Fortsatz kurz, fingerförmig, zur Spitze weniger verschmälert, gebogen", "A:tadovaniensis"]],
  [["(Männchen, Genital) Hinterrand des linken ventralen Lappens abgestutzt; nur Südwestiran", "A:khozestani"], ["(Männchen, Genital) Hinterrand schräg; nicht im Südiran (Türkei bis Nordostiran)", "A:brevipugilis"]],
] });

M.push({ gen: "Galepsus", q: "Giglio-Tos, E. (1911): Mantidi esotici IV. Gen. Galepsus Stål. Bollettino della Società entomologica italiana 42: 142–147 (lateinische Bestimmungstabelle; ersetzt die im Scan von 1927 fehlende Seite)", t: "Giglio-Tos 1911", c: [
  [["Vorderschenkel außen (außer dem Enddorn) mit 5 Dornen", 2], ["Vorderschenkel außen (außer dem Enddorn) mit 4 Dornen", 3]],
  [["Vorderschenkelringe und Vorderschenkel innen schwarz gefleckt (Westafrika)", "A:laticeps"], ["Vorderschenkelringe und Vorderschenkel innen nicht schwarz gefleckt (Ostafrika)", "A:nyassensis"]],
  [["Vorderhüften innen zumindest teilweise schwarz oder dunkel", 4], ["Vorderhüften innen nicht schwarz, höchstens ganz an der Spitze schmal schwarz gesäumt", 9]],
  [["Scheitel vorgezogen, dreilappig", "A:lenticularis"], ["Scheitel nicht vorgezogen, nicht dreilappig", 5]],
  [["Scheitel abgestutzt, beiderseits an den Augen zweimal eingekerbt (Weibchen)", "A:toganus"], ["Scheitel leicht gerundet, nicht eingekerbt", 6]],
  [["Hinterer Teil der Vorderbrust mit zwei runden schwarzen Flecken (Weibchen)", "A:dispar"], ["Hinterer Teil der Vorderbrust mit nur einem schwarzen Fleck", 7]],
  [["Fleck der Vorderbrust vorn dreilappig (Weibchen)", "A:modestus"], ["Fleck der Vorderbrust unregelmäßig", 8]],
  [["Vorderhüften innen in der unteren (vorderen) Hälfte gelbbraun, nicht punktiert (Weibchen)", "A:dubius"], ["Vorderhüften innen in der unteren Hälfte gelbbraun, dunkel punktiert (Weibchen)", "A:montanus"]],
  [["Scheitel beiderseits in einen kegelförmigen Höcker ausgezogen", "A:kuhlgatzi"], ["Scheitel ohne Höcker", 10]],
  [["Vorderschenkelringe innen schwarz gefleckt oder mit schwarzem Punkt", 11], ["Vorderschenkelringe innen ungefleckt", 24]],
  [["Vorderschienen innen schwarz (Vorderschenkel innen schwarz oder schwarz gefleckt)", "A:femoratus"], ["Vorderschienen innen gleichfarbig", 12]],
  [["Vorderhüften innen an der Spitze mit schwarzer Querbinde oder Fleck", 13], ["Spitze der Vorderhüften ohne schwarze Binde", 15]],
  [["Hinterflügel der Männchen rauchig, Weibchen ohne Hinterflügel; Deckflügel der Weibchen weit auseinander", "A:tenuis"], ["Hinterflügel der Männchen schmutzig glasklar, Weibchen mit winzigen Hinterflügeln; Deckflügel der Weibchen an der Spitze aneinander", 14]],
  [["Kopf breiter, Körper kräftiger; Stirnschild breiter als hoch", "A:meridionalis"], ["Kopf schmaler, Körper schlanker; Stirnschild höher als breit", "A:gracilis"]],
  [["Vorderbrust vor dem Hinterrand mit schwarzer Querbinde", 16], ["Vorderbrust mit ein oder zwei Flecken, ohne Querbinde", 17]],
  [["Scheitel stumpf dreieckig vorgezogen", "A:feae"], ["Scheitel gerundet", "A:konakrynus"]],
  [["Kopf breit; Augen von vorn gesehen seitlich gerundet", "A:affinis"], ["Kopf schmaler; Augenränder von vorn gesehen seitlich fast gerade und parallel", 18]],
  [["Vorderschenkel innen am Grund der großen Dornen mit winzigem schwarzem Punkt", 19], ["Vorderschenkel innen ohne schwarze Punkte am Grund der großen Dornen", 22]],
  [["Vorderschenkel innen außerdem mit einigen schwarzen Flecken am Unterrand", "A:zambesicus"], ["Vorderschenkel innen sonst ungefleckt", 20]],
  [["Stirnschild breiter als hoch, quer; größer", "A:meridionalis"], ["Stirnschild nicht quer", 21]],
  [["Größer; Stirnschild fast quadratisch", "A:diversus"], ["Kleiner; Stirnschild höher als breit", "A:intermedius"]],
  [["Scheitel abgestutzt", 23], ["Scheitel leicht gerundet", "A:pentheri"]],
  [["Größer; äußere obere Augenecke gerundet", "A:zambesicus"], ["Kleiner; äußere obere Augenecke fast spitz", "A:erythraeus"]],
  [["Hinterer Teil der Vorderbrust mit zwei runden schwarzen Flecken", 25], ["Vorderbrust mit nur einem Fleck", 26]],
  [["Deckflügel der Männchen so lang wie der Hinterleib", "A:modestior"], ["Deckflügel der Männchen kürzer als der Hinterleib", "A:dispar"]],
  [["Fleck der Vorderbrust vorn dreilappig", "A:modestus"], ["Fleck der Vorderbrust nicht dreilappig", 27]],
  [["Scheitel mehr oder weniger gerundet; äußere obere Augenecke gerundet", 28], ["Scheitel gerade abgestutzt", 31]],
  [["Stirnschild deutlich quer; Augen von vorn gesehen seitlich deutlich gerundet", "A:damaranus"], ["Stirnschild nicht quer; Augen seitlich kaum gerundet", 29]],
  [["Vorderbrust mit schwarzem Längsstreifen", 30], ["Vorderbrust in der Mitte mit fast rundem tiefschwarzem Fleck", "A:montanus"]],
  [["Kopf breiter, Körper kräftiger (Ostafrika)", "A:dubius"], ["Kopf schmaler, Körper schlanker (Westafrika)", "A:pentheri"]],
  [["Äußere obere Augenecke gerade, aber an der Spitze gerundet", 32], ["Äußere obere Augenecke spitz", 33]],
  [["Größer; Augenecke breit gerundet", "A:capitatus"], ["Kleiner; Augenecke sehr eng gerundet", "A:minutus"]],
  [["Hinter- und Deckflügel blass gelblich glasklar", "A:buettneri"], ["Hinter- und Deckflügel rauchig", 34]],
  [["Scheitel fast ganzrandig oder kaum eingekerbt; Augenecke spitz, ohne Stachelspitze (Westafrika)", "A:toganus"], ["Scheitel beiderseits deutlich zweimal eingekerbt; Augenecke sehr spitz, mit Stachelspitze (Ostafrika)", "A:gestri"]],
] });

M.push({ gen: "Hierodula", q: "Liu, Q.-P. et al. (2021): Taxonomic revision of the praying mantis subfamily Hierodulinae of China. Zootaxa 4951: 401–433 (Teil Hierodula).", t: "Liu et al. 2021", c: [
  [["Hinterer Halsschildteil 1,8- bis 2,3-mal so lang wie der vordere; (Männchen) Genitalfortsatz nicht deutlich zweilappig", 2], ["Hinterer Halsschildteil 2,3- bis 3,5-mal so lang wie der vordere; (Männchen) Genitalfortsatz zweilappig", 4]],
  [["Vorderschenkel innen mit schwarzem Fleck", "A:maculata"], ["Vorderschenkel innen ohne schwarzen Fleck", 3]],
  [["Vorderhüften mit 4–5 winzigen, stark zurückgebildeten Dornen (besonders beim Männchen)", "A:tenuidentata"], ["Dornen der Vorderhüften deutlich und groß, meist höchstens 4", "A:patellifera"]],
  [["Halsschild 4-mal so lang wie breit; Mittelfeld der Deckflügel bei beiden Geschlechtern glasklar", "A:dyaka"], ["Halsschild weniger als 4-mal so lang wie breit; Mittelfeld der Weibchen fast oder ganz undurchsichtig", 5]],
  [["Vorderhüften mit mindestens 10 winzigen Dornen; Flügelmal klein, punktförmig", "A:confusa"], ["Weniger als 10 Hüftdornen; Flügelmal schmal, deutlich länger als breit", 6]],
  [["Nur der 2., 4., 10. und 15. vordere Unterranddorn des Vorderschenkels an der Basis schwarz", "A:pistillinota"], ["Unterranddornen ungefärbt oder mehr als diese vier an der Basis gefärbt", 7]],
  [["Halsschild mehr als 3-mal so lang wie breit", "A:chinensis"], ["Halsschild weniger als 3-mal so lang wie breit", 8]],
  [["Halsschild etwa 2,6-mal so lang wie breit", 9], ["Halsschild weniger als 2,6-mal so lang wie breit", 10]],
  [["Vorderseite der Vorderhüften im Leben hellblau", "A:jianfenglingensis"], ["Vorderseite der Vorderhüften ohne Blau", "A:longa"]],
  [["Halsschild kaum verbreitert, hinter der Querfurche deutlich eingeschnürt; Hüftdornen sehr groß, stumpf und glänzend; Flügelmal an beiden Enden hellbraun gesäumt", "A:latipennis"], ["Halsschild verbreitert, ohne Einschnürung; Hüftdornen mittelgroß; Flügelmal ohne braunen Saum", "A:zhangi"]],
] });
M.push({ gen: "Rhombodera", q: "Liu, Q.-P. et al. (2021): Taxonomic revision of the praying mantis subfamily Hierodulinae of China. Zootaxa 4951 (Teil Rhombodera).", t: "Liu et al. 2021", c: [
  [["Halsschild fast so lang wie breit, etwa doppelt so breit wie der Kopf", "A:latipronotum"], ["Halsschild deutlich länger als breit", "A:valida"]],
] });
M.push({ gen: "Rhombomantis", q: "Liu, Q.-P. et al. (2021): Hierodulinae of China. Zootaxa 4951.", t: "Liu et al. 2021", c: [
  [["Halsschild etwa 1,5-mal so lang wie an der breitesten Stelle breit; Vorderhüften innen mit blau-weißer Binde", "A:longipennis"], ["Halsschild etwa doppelt so lang wie breit; Vorderhüften innen einfarbig", "A:fusca"]],
] });

const ISR = { q: "Simon, D. et al. (2025): The Mantodea of Israel and adjacent areas. Israel Journal of Entomology 54 (Schlüssel für Israel)", t: "Simon et al. 2025 (Israel)" };
M.push({ ...ISR, gen: "Eremiaphila", c: [
  [["Vorderhüften und -schenkel innen mit schwarzen Flecken (schon bei Larven)", "A:brunneri"], ["Vorderhüften und -schenkel innen ohne schwarze Flecken", 2]],
  [["Flügel reichen nicht über den 1. Hinterleibsring; Weibchen mit kurzen Querkielen auf Hinterleibsringen 3–7", "A:bovei"], ["Flügel reichen über den 1. Hinterleibsring", 3]],
  [["Halsschild deutlich rau und gekörnt; Hinterflügel rötlich mit schwarzem Spitzenstreif (Hermon, über 1600 m)", "A:genei"], ["Halsschild glatter, kaum gekörnt", 4]],
  [["Vorderer und hinterer Halsschildteil deutlich gewölbt; Hinterflügel mit hellem Spitzenstreif", "A:braueri"], ["Halsschildteile nur schwach gewölbt; Hinterflügel mit dunklem Spitzenstreif", "A:arabica"]],
] });
M.push({ ...ISR, gen: "Empusa", c: [
  [["Spitze des hinteren Kopfschilds senkrecht; Vorderschenkel breit (etwa 5-mal so lang wie breit)", "A:fasciata"], ["Spitze des hinteren Kopfschilds nach vorn gebogen; Vorderschenkel schmal (6–9-mal so lang wie breit)", 2]],
  [["Lappen der Mittelhüften beim Weibchen etwa 7-mal, beim Männchen 13-mal so breit wie hoch; Bauchlappen schwach (Grabenbruch bis Hermon)", "A:hedenborgii"], ["Lappen der Mittelhüften beim Weibchen etwa 6-mal, beim Männchen 16-mal so breit wie hoch; Bauchlappen deutlich (zentraler Negev)", "A:guttula"]],
] });
M.push({ ...ISR, gen: "Pareuthyphlebs", c: [
  [["Halsschild verhältnismäßig breit (4–5-mal so lang wie breit); Augendorn röhrenförmig mit stumpfer Spitze; Scheitelfortsatz kurz, an der Spitze schwach gegabelt", "A:occidentalis"], ["Halsschild schlank (etwa 6-mal so lang wie breit); Augendorn mit kegelförmiger Spitze; Scheitelfortsatz etwas länger, gegabelt", "A:palmonii"]],
] });
M.push({ ...ISR, gen: "Ameles", c: [
  [["Augen kegelförmig, mit Endhöckerchen", "A:heldreichi"], ["Augen gerundet, ohne Endhöcker; Weibchen mit kurzen Querkielen auf den Hinterleibsringen 2–5", "A:kervillei"]],
] });
M.push({ ...ISR, gen: "Iris", c: [
  [["Hinterer Kopfschild 2,5- bis 3-mal so breit wie hoch; Weibchen: Fleck der Hinterflügel kompakt, rund, schwarz", "A:deserti"], ["Hinterer Kopfschild etwa doppelt so breit wie hoch", 2]],
  [["Fleck der Hinterflügel rund, schwarz, mit dunklem Adernetz", "A:oratoria"], ["Fleck der Hinterflügel undeutlich, verwaschen oder nur aus dunklem Adernetz", "A:caeca"]],
] });
M.push({ ...ISR, gen: "Severinia", c: [
  [["Cercusglieder deutlich ungleich breit, letztes Glied am Ende flach ausgerandet; Analfeld der Hinterflügel gelb", "A:lemoroi"], ["Cercusglieder fast gleich breit, letztes Glied am Ende gerundet; Hinterflügel mit verwaschenem braunem Fleck zwischen Mittel- und Analfeld", "A:popovi"]],
] });
M.push({ ...ISR, gen: "Rivetina", c: [
  [["(Männchen) Hinterer Halsschildteil weniger als 4-mal so lang wie an der schmalsten Stelle breit", 2], ["(Männchen) Hinterer Halsschildteil mehr als 4-mal so lang wie schmal; Flügel nur bis zum 7.–9. Hinterleibsring", "A:byblica"]],
  [["(Männchen) Flügel reichen bis zur Afterdeckplatte oder darüber; Halsschild fein gezähnt", "A:baetica"], ["(Männchen) Flügel nur bis zum 5.–9. Hinterleibsring; Halsschild kräftig gezähnt", "A:balcanica"]],
] });
M.push({ gen: "Paraoxypilus", q: "Revision der Gattung Paraoxypilus, Records of the Australian Museum 76 (2024); P. distinctus und P. flavifemur dort als Synonyme von P. tasmaniensis", t: "Rec. Aust. Mus. 2024", c: [
  [["Kopf neben den Augen mit deutlichen Dornen", 2], ["Kopf neben den Augen ohne deutliche Dornen", 3]],
  [["Innenseite der Vorderbeine mit stark kontrastierenden Farben (schwarz-weiß)", "A:tasmaniensis"], ["Innenseite der Vorderbeine ohne starke Farbkontraste", "A:armatus"]],
  [["Höcker auf dem Scheitel mit spitzem Ende", "A:verreauxii"], ["Höcker auf dem Scheitel breit gerundet", 4]],
  [["Halsschildrand über der Ansatzstelle der Vorderhüften mit auffälligem Dorn (Lupe)", "A:kimberleyensis"], ["Halsschildrand dort nur mit winzigem Dörnchen", "A:atra"]],
] });
M.push({ gen: "Pseudomiopteryx", q: "Ferraz, B.R. & Rivera, J. (2026): Two new species of Pseudomiopteryx from the Brazilian Amazon, with an updated key. European Journal of Taxonomy 1101 (nach Favacho et al. 2023)", t: "Ferraz & Rivera 2026", c: [
  [["(Nur Männchen, Genitalpräparat unter dem Binokular nötig) Spitze des linken Genitalfortsatzes (afa) gegabelt", 2], ["(Genitalpräparat) Spitze des afa nicht gegabelt", 6]],
  [["(Genitalpräparat) afa mit deutlichem Buckel nahe der Basis", "A:spinifrons"], ["(Genitalpräparat) afa ohne Buckel", 3]],
  [["(Genitalpräparat) Gabeläste des afa sehr ungleich", 4], ["(Genitalpräparat) Gabeläste fast gleich groß", 5]],
  [["(Genitalpräparat) Lappen des Phallomers L4B kaum vorgezogen, breit gebogen", "A:akuntsu"], ["(Genitalpräparat) Lappen L4B stark vorgezogen", "A:riverai"]],
  [["(Genitalpräparat) Fortsatz sdp kräftig, am Ende gebogen", "A:bogotensis"], ["(Genitalpräparat) Fortsatz sdp schmal und gerade", "A:decipiens"]],
  [["(Genitalpräparat) Fortsatz sdp breit", 7], ["(Genitalpräparat) Fortsatz sdp schmal, spitz zulaufend", 8]],
  [["(Genitalpräparat) Rechter Rand zwischen Seitenlappen und sdp mit zwei Lappen", "A:guyanensis"], ["(Genitalpräparat) dort mit einem Lappen", "A:columbica"]],
  [["(Genitalpräparat) Bauchseitiges Phallomer neben sdp mit kleinem Fortsatz", 9], ["(Genitalpräparat) ohne diesen Fortsatz", 10]],
  [["(Genitalpräparat) Spitze des sdp spitz", "A:festae"], ["(Genitalpräparat) Spitze des sdp gerundet", "A:maculata"]],
  [["(Genitalpräparat) L4B mit großem dreieckigem Lappen", 11], ["(Genitalpräparat) L4B ohne Lappen", "A:chicomendesi"]],
  [["(Genitalpräparat) sdp lang, schmal, speerspitzenförmig", 12], ["(Genitalpräparat) sdp kurz, breit, zahnförmig stumpf", "A:gorgonae"]],
  [["Fundort Mittelamerika oder Südmexiko", "A:infuscata"], ["Fundort Kolumbien", "A:meridana"]],
] });
const KOR = { q: "Shim, J. & Song, J.-H. (2024): Taxonomy of Korean Mantodea: Morphology & DNA Barcodes. ZooKeys 1206 (Schlüssel für Korea)", t: "Shim & Song 2024 (Korea)" };
M.push({ ...KOR, gen: "Tenodera", c: [
  [["Vorderhüften an der Basis gelb (lebend); Hinterflügel an der Basis dunkelbraun, Vorderrandbereich braun", "A:sinensis"], ["Vorderhüften an der Basis orange (lebend); Hinterflügelbasis durchsichtig, Vorderrandbereich rötlich", "A:angustipennis"]],
] });
M.push({ ...KOR, gen: "Hierodula", c: [
  [["Bauchplatte zwischen den Hinterbeinen (Furcasternit) ohne Muster", "A:chinensis"], ["Diese Bauchplatte mit zwei dunklen Querbinden", "A:patellifera"]],
] });
// Eigene Ergänzungen aus Differentialdiagnosen der Erstbeschreibungen:
// { gen, alt: "epitheton im Schlüssel", neu: "epitheton der neuen Art", tNeu, tAlt, q }
const Z = [];
Z.push(
  { gen: "Didymocorypha", alt: "lanceolata", neu: "libaii", tNeu: "Klein; Punktaugen der Männchen klein und undeutlich; erwachsene Männchen flügellos", tAlt: "Größer; Punktaugen der Männchen deutlich; Männchen geflügelt", q: "Erstbeschreibung von D. libaii (2020)" },
  { gen: "Junodia", alt: "amoena", neu: "maternaschulzei", tNeu: "Scheitelfortsatz am Ende gerundet, nicht zweilappig", tAlt: "Scheitelfortsatz am Ende zweilappig", q: "Stiewe & Roy 2010 (Erstbeschreibung von J. maternaschulzei)" },
  { gen: "Prohierodula", alt: "laticollis", neu: "grassei", tNeu: "(Männchen) Dunkler Teil des Hinterflügel-Analfelds ausgedehnt, ohne durchgehenden glasklaren Saum am Außenrand", tAlt: "(Männchen) Dunkler Teil des Analfelds weniger ausgedehnt: am ganzen Außenrand ein durchgehender glasklarer Saum, einige glasklare Binden setzen sich ins Mittelfeld fort", q: "Roy 1967 (Prohierodula)" },
  { gen: "Stagmomantis", alt: "carolina", neu: "hebardi", tNeu: "(Männchen) Halsschild verhältnismäßig länger und schlanker; Augen größer und kugelig vorstehend; Mundbereich kleiner", tAlt: "(Männchen) Halsschild kürzer und kräftiger; Augen kleiner, weniger vorstehend", q: "Rehn 1935 (Erstbeschreibung von S. hebardi)" },
  { gen: "Stenophylla", alt: "cornigera", neu: "lobivertex", tNeu: "Mittlerer Scheitelfortsatz auffallend groß (lappenförmig)", tAlt: "Mittlerer Scheitelfortsatz klein", q: "Erstbeschreibung von S. lobivertex" },
  { gen: "Tropidomantis", alt: "tenera", neu: "gressitti", tNeu: "Etwas größer; Männchen: Zellen in der basalen Hälfte der Deckflügel und entlang des Vorderrandfelds mit großen gelblich-ockerfarbenen Zentren", tAlt: "Männchen: Deckflügel ganz durchsichtig", q: "Erstbeschreibung von T. gressitti" },
);
Z.push(
  { gen: "Hymenopus", alt: "coronatus", neu: "coronatoides", tNeu: "Spitzen der Deck- und Hinterflügel breit gerundet; Vorderschiene mit 22–23 Außen- und 19 Innendornen", tAlt: "Flügelspitzen weniger breit gerundet", q: "Erstbeschreibung von H. coronatoides" },
  { gen: "Humbertiella", alt: "similis", neu: "nada", tNeu: "Hinterflügel tief rauchig, fast glänzend purpurn, Spitzenmitte hellbraun", tAlt: "Hinterflügel nicht so dunkel purpurn", q: "Erstbeschreibung von H. nada" },
  { gen: "Oligonicella", alt: "scudderi", neu: "tessellata", tNeu: "Halsschild fein gezähnelt; Deckflügel mit dickem, dreieckigem weißem Flügelmal ohne weißen Bogen; Schenkelfleck fast fehlend", tAlt: "Halsschild nicht so gezähnelt; Flügelmal mit weißem Bogen; Schenkelfleck deutlich", q: "Erstbeschreibung von O. tessellata" },
  { gen: "Hestiasula", alt: "*", neu: "brachyptera", tNeu: "Weibchen mit verkürzten Flügeln; kleine Art mit stark entwickeltem Kopffortsatz und gefleckten Schenkeln (Südostindien)", tAlt: "Weibchen voll geflügelt", q: "Villani 2016 (Erstbeschreibung von H. brachyptera)" },
  { gen: "Acanthops", alt: "*", neu: "occidentalis", tNeu: "Vorderschenkel außen mit 7 Dornen", tAlt: "Vorderschenkel außen mit weniger als 7 Dornen", q: "Erstbeschreibung von A. occidentalis" },
  { gen: "Hierodula", alt: "*", neu: "maculata", tNeu: "Vorderschenkel innen mit großem schwarzem Fleck (nach der Erstbeschreibung das kennzeichnende Merkmal)", tAlt: "Vorderschenkel innen ohne diesen großen schwarzen Fleck", q: "Erstbeschreibung von H. maculata" },
  { gen: "Agrionopsis", alt: "*", neu: "bacilliformis", tNeu: "4 Scheibendornen; Deckflügel stark verkürzt; Randfeld der Deckflügel grün", tAlt: "3 Scheibendornen oder Deckflügel länger; Randfeld gelbbraun", q: "Erstbeschreibung von A. bacilliformis (Beier)" },
  { gen: "Amorphoscelis", alt: "*", neu: "chinensis", tNeu: "Größer als alle anderen Arten der Gattung; vorderer Halsschildteil mit zwei Paar erhabener Höcker", tAlt: "Kleiner; Halsschild ohne zwei Höckerpaare", q: "Tinkham 1937 (Erstbeschreibung von A. chinensis)" },
);
module.exports = { M, Z };
