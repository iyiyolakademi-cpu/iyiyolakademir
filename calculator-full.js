/* Original calculator functions provided by the site owner. */


/* =========================================================
   YARDIMCI
========================================================= */

function paId(id){
  return document.getElementById(id);
}


function paNum(id){

  var el = paId(id);

  if(!el){
    return 0;
  }

  var text = el.value;

  if(typeof text === "string"){
    text = text.replace(",",".");
  }

  var n = parseFloat(text);

  if(isNaN(n)){
    return 0;
  }

  return n;
}


function paMoney(n){

  var negative = n < 0;

  n = Math.abs(n);

  n = Math.round(n * 100) / 100;

  var text = n.toFixed(2);

  text = text.replace(".",",");

  if(negative){
    return "-" + text + " ₺";
  }

  return text + " ₺";
}


function paShow(id){

  var el = paId(id);

  if(el){
    el.className = "pa-result pa-show";
  }

}


/* =========================================================
   NAVİGASYON
========================================================= */

function paHideAll(){

  var screens =
  document.getElementsByClassName("pa-screen");

  var i;

  for(i=0;i<screens.length;i++){

    screens[i].className =
    "pa-screen";

  }

}


function paOpen(name){

  paHideAll();

  var target =
  paId("pa-screen-" + name);

  if(target){

    target.className =
    "pa-screen pa-active";

  }

  try{
    window.scrollTo(0,0);
  }catch(e){}

}


function paHome(){

  paHideAll();

  paId("pa-screen-menu").className =
  "pa-screen pa-active";

  try{
    window.scrollTo(0,0);
  }catch(e){}

}


/* =========================================================
   ARAMA
========================================================= */

function paSearchTools(){

  var query =
  paId("pa-search").value.toLowerCase();

  var items =
  document.getElementsByClassName("pa-menu-item");

  var visible = 0;

  var i;

  for(i=0;i<items.length;i++){

    var name =
    items[i].getAttribute("data-name");

    if(
      name.toLowerCase().indexOf(query) > -1
    ){

      items[i].style.display =
      "flex";

      visible++;

    }else{

      items[i].style.display =
      "none";

    }

  }

  paId("pa-empty").style.display =
  visible === 0
  ?
  "block"
  :
  "none";

}


/* =========================================================
   KOMİSYON
========================================================= */

function paKomisyon(){

  var amount =
  paNum("kom-tutar");

  var rate =
  paNum("kom-oran");

  if(amount <= 0){

    alert(
      "Lütfen satış tutarını girin."
    );

    return;

  }

  if(rate < 0 || rate > 100){

    alert(
      "Komisyon oranı 0 ile 100 arasında olmalıdır."
    );

    return;

  }

  var commission =
  amount * rate / 100;

  var net =
  amount - commission;

  paId("kom-net").innerHTML =
  "Net: " + paMoney(net);

  paId("kom-kesinti").innerHTML =
  paMoney(commission);

  paId("kom-elegecen").innerHTML =
  paMoney(net);

  paShow("kom-result");

}


/* =========================================================
   İNDİRİM
========================================================= */

function paIndirim(){

  var price =
  paNum("ind-price");

  var rate =
  paNum("ind-rate");

  if(price <= 0){

    alert(
      "Lütfen ürün fiyatını girin."
    );

    return;

  }

  if(rate < 0 || rate > 100){

    alert(
      "İndirim oranı 0 ile 100 arasında olmalıdır."
    );

    return;

  }

  var saving =
  price * rate / 100;

  var finalPrice =
  price - saving;

  paId("ind-final").innerHTML =
  "İndirimli Fiyat: " +
  paMoney(finalPrice);

  paId("ind-saving").innerHTML =
  paMoney(saving);

  paShow("ind-result");

}


/* =========================================================
   UYKU
========================================================= */

function paSleepLabel(){

  var type =
  paId("sleep-type").value;

  if(type === "wake"){

    paId("sleep-label").innerHTML =
    "Kalkış Saati";

  }else{

    paId("sleep-label").innerHTML =
    "Yatış Saati";

  }

}


function paClock(date){

  var h =
  date.getHours();

  var m =
  date.getMinutes();

  if(h < 10){
    h = "0" + h;
  }

  if(m < 10){
    m = "0" + m;
  }

  return h + ":" + m;

}


function paUyku(){

  var type =
  paId("sleep-type").value;

  var time =
  paId("sleep-time").value;

  if(time === ""){

    alert(
      "Lütfen bir saat seçin."
    );

    return;

  }

  var parts =
  time.split(":");

  var base =
  new Date(
    2020,
    0,
    1,
    parseInt(parts[0],10),
    parseInt(parts[1],10),
    0,
    0
  );

  var html = "";

  var i;

  if(type === "wake"){

    paId("sleep-title").innerHTML =
    "Yaklaşık yatış saatleri";

    for(i=6;i>=4;i--){

      var sleep =
      new Date(
        base.getTime()
        -
        ((i * 90) + 15) * 60000
      );

      html +=
      '<span class="pa-chip">'
      +
      paClock(sleep)
      +
      "<br>"
      +
      i
      +
      " döngü"
      +
      "</span>";

    }

  }else{

    paId("sleep-title").innerHTML =
    "Yaklaşık kalkış saatleri";

    for(i=4;i<=6;i++){

      var wake =
      new Date(
        base.getTime()
        +
        ((i * 90) + 15) * 60000
      );

      html +=
      '<span class="pa-chip">'
      +
      paClock(wake)
      +
      "<br>"
      +
      i
      +
      " döngü"
      +
      "</span>";

    }

  }

  paId("sleep-chips").innerHTML =
  html;

  paShow("sleep-result");

}


/* =========================================================
   MAAŞ
========================================================= */

function paMaas(){

  var salary =
  paNum("salary");

  var days =
  paNum("work-days");

  var hours =
  paNum("work-hours");

  if(
    salary <= 0 ||
    days <= 0 ||
    hours <= 0
  ){

    alert(
      "Lütfen tüm alanları doldurun."
    );

    return;

  }

  if(days > 7){

    alert(
      "Haftalık çalışma günü 7'den fazla olamaz."
    );

    return;

  }

  if(hours > 24){

    alert(
      "Günlük çalışma saati 24'ten fazla olamaz."
    );

    return;

  }

  var monthlyHours =
  days *
  hours *
  4.345;

  var hourly =
  salary /
  monthlyHours;

  var daily =
  hourly *
  hours;

  var weekly =
  daily *
  days;

  paId("salary-hourly").innerHTML =
  paMoney(hourly)
  +
  " / saat";

  paId("salary-daily").innerHTML =
  paMoney(daily);

  paId("salary-weekly").innerHTML =
  paMoney(weekly);

  paId("salary-hours").innerHTML =
  Math.round(monthlyHours)
  +
  " saat";

  paShow("salary-result");

}


/* =========================================================
   SINAV
========================================================= */

var paExams = {

  tyt:[
    ["Türkçe",40],
    ["Sosyal Bilimler",20],
    ["Temel Matematik",40],
    ["Fen Bilimleri",20]
  ],

  say:[
    ["Matematik",40],
    ["Fizik",14],
    ["Kimya",13],
    ["Biyoloji",13]
  ],

  ea:[
    ["Matematik",40],
    ["Edebiyat",24],
    ["Tarih-1",10],
    ["Coğrafya-1",6]
  ],

  soz:[
    ["Edebiyat / Sosyal-1",24],
    ["Tarih-1",10],
    ["Coğrafya-1",6],
    ["Tarih-2",11],
    ["Coğrafya-2",11],
    ["Felsefe Grubu",12],
    ["Din Kültürü",6]
  ]

};


function paExamFields(){

  var type =
  paId("exam-type").value;

  var data =
  paExams[type];

  var html = "";

  var i;

  for(i=0;i<data.length;i++){

    html +=

    '<div class="pa-row">'

    +

    '<div class="pa-field">'

    +

    '<label class="pa-label">'

    +

    data[i][0]

    +

    ' Doğru</label>'

    +

    '<input class="pa-input" type="number" id="exam-d-'

    +

    i

    +

    '" placeholder="0">'

    +

    '</div>'

    +

    '<div class="pa-field">'

    +

    '<label class="pa-label">'

    +

    data[i][0]

    +

    ' Yanlış</label>'

    +

    '<input class="pa-input" type="number" id="exam-y-'

    +

    i

    +

    '" placeholder="0">'

    +

    '</div>'

    +

    '</div>';

  }

  paId("exam-fields").innerHTML =
  html;

  paId("exam-result").className =
  "pa-result";

}


function paExamCalc(){

  var type =
  paId("exam-type").value;

  var data =
  paExams[type];

  var total = 0;

  var html = "";

  var i;

  for(i=0;i<data.length;i++){

    var correct =
    paNum(
      "exam-d-" + i
    );

    var wrong =
    paNum(
      "exam-y-" + i
    );

    if(
      correct < 0 ||
      wrong < 0 ||
      correct + wrong > data[i][1]
    ){

      alert(
        data[i][0]
        +
        " bölümünde doğru + yanlış sayısı "
        +
        data[i][1]
        +
        " soruyu geçemez."
      );

      return;

    }

    var net =
    correct -
    wrong / 4;

    total +=
    net;

    html +=

    '<div class="pa-result-line">'

    +

    '<div class="pa-result-left">'

    +

    data[i][0]

    +

    '</div>'

    +

    '<div class="pa-result-right">'

    +

    net
    .toFixed(2)
    .replace(".",",")

    +

    ' net</div>'

    +

    '</div>';

  }

  paId("exam-total").innerHTML =
  "Toplam Net: "
  +
  total
  .toFixed(2)
  .replace(".",",");

  paId("exam-lines").innerHTML =
  html;

  paShow("exam-result");

}


/* =========================================================
   TARİH
========================================================= */

function paDateCalc(){

  var start =
  paId("date-start").value;

  var end =
  paId("date-end").value;

  if(
    start === "" ||
    end === ""
  ){

    alert(
      "Lütfen başlangıç ve bitiş tarihlerini seçin."
    );

    return;

  }

  var a =
  start.split("-");

  var b =
  end.split("-");

  var d1 =
  new Date(
    parseInt(a[0],10),
    parseInt(a[1],10)-1,
    parseInt(a[2],10)
  );

  var d2 =
  new Date(
    parseInt(b[0],10),
    parseInt(b[1],10)-1,
    parseInt(b[2],10)
  );

  var diff =
  Math.abs(
    d2.getTime()
    -
    d1.getTime()
  );

  var days =
  Math.round(
    diff /
    86400000
  );

  paId("date-days").innerHTML =
  days
  +
  " gün";

  paId("date-weeks").innerHTML =
  (days / 7)
  .toFixed(1)
  .replace(".",",")
  +
  " hafta";

  paId("date-months").innerHTML =
  (days / 30.44)
  .toFixed(1)
  .replace(".",",")
  +
  " ay";

  paShow("date-result");

}


/* =========================================================
   BMI
========================================================= */

function paBMI(){

  var weight =
  paNum("bmi-weight");

  var height =
  paNum("bmi-height");

  if(
    weight <= 0 ||
    height <= 0
  ){

    alert(
      "Lütfen kilo ve boy bilgilerinizi girin."
    );

    return;

  }

  var meter =
  height / 100;

  var bmi =
  weight /
  (meter * meter);

  var category = "";

  if(bmi < 18.5){

    category =
    "Düşük kilo";

  }else if(bmi < 25){

    category =
    "Normal aralık";

  }else if(bmi < 30){

    category =
    "Fazla kilolu";

  }else if(bmi < 35){

    category =
    "Obezite I";

  }else if(bmi < 40){

    category =
    "Obezite II";

  }else{

    category =
    "Obezite III";

  }

  paId("bmi-value").innerHTML =
  "VKİ: "
  +
  bmi
  .toFixed(1)
  .replace(".",",");

  paId("bmi-category").innerHTML =
  "Kategori: <strong>"
  +
  category
  +
  "</strong>";

  paShow("bmi-result");

}


/* =========================================================
   KALORİ
========================================================= */

function paCalories(){

  var age =
  paNum("cal-age");

  var weight =
  paNum("cal-weight");

  var height =
  paNum("cal-height");

  var gender =
  paId("cal-gender").value;

  var activity =
  parseFloat(
    paId("cal-activity").value
  );

  if(
    age <= 0 ||
    weight <= 0 ||
    height <= 0 ||
    gender === ""
  ){

    alert(
      "Lütfen tüm alanları doldurun."
    );

    return;

  }

  var bmr;

  if(gender === "e"){

    bmr =
    10 * weight
    +
    6.25 * height
    -
    5 * age
    +
    5;

  }else{

    bmr =
    10 * weight
    +
    6.25 * height
    -
    5 * age
    -
    161;

  }

  var total =
  bmr *
  activity;

  paId("cal-total").innerHTML =
  "Yaklaşık "
  +
  Math.round(total)
  +
  " kcal / gün";

  paId("cal-bmr").innerHTML =
  Math.round(bmr)
  +
  " kcal";

  paId("cal-low").innerHTML =
  Math.round(total * 0.90)
  +
  " kcal";

  paId("cal-high").innerHTML =
  Math.round(total * 1.10)
  +
  " kcal";

  paShow("cal-result");

}


/* =========================================================
   SU
========================================================= */

function paWater(){

  var weight =
  paNum("water-weight");

  var activity =
  paNum("water-activity");

  var climate =
  parseFloat(
    paId("water-climate").value
  );

  if(weight <= 0){

    alert(
      "Lütfen kilonuzu girin."
    );

    return;

  }

  /*
     Basit yaklaşık tahmin:
     35 ml / kg
     + her 30 dk aktivite için 350 ml
     + sıcak ortam çarpanı
  */

  var liters =
  weight *
  35 /
  1000;

  liters +=
  (activity / 30)
  *
  0.35;

  liters *=
  climate;

  var glasses =
  Math.round(
    liters *
    1000 /
    200
  );

  paId("water-liters").innerHTML =
  "Yaklaşık "
  +
  liters
  .toFixed(2)
  .replace(".",",")
  +
  " litre / gün";

  paId("water-glasses").innerHTML =
  glasses
  +
  " bardak";

  paShow("water-result");

}


/* =========================================================
   YAĞ ORANI
========================================================= */

function paFatGender(){

  var gender =
  paId("fat-gender").value;

  if(gender === "k"){

    paId("fat-hip-field").style.display =
    "block";

  }else{

    paId("fat-hip-field").style.display =
    "none";

  }

}


function paBodyFat(){

  var gender =
  paId("fat-gender").value;

  var height =
  paNum("fat-height");

  var neck =
  paNum("fat-neck");

  var waist =
  paNum("fat-waist");

  var hip =
  paNum("fat-hip");

  if(
    gender === "" ||
    height <= 0 ||
    neck <= 0 ||
    waist <= 0
  ){

    alert(
      "Lütfen gerekli alanları doldurun."
    );

    return;

  }

  var bf;

  if(gender === "e"){

    if(waist <= neck){

      alert(
        "Bel çevresi boyun çevresinden büyük olmalıdır."
      );

      return;

    }

    bf =
    495 /
    (
      1.0324
      -
      0.19077 *
      (
        Math.log(waist-neck)
        /
        Math.LN10
      )
      +
      0.15456 *
      (
        Math.log(height)
        /
        Math.LN10
      )
    )
    -
    450;

  }else{

    if(hip <= 0){

      alert(
        "Kadınlar için kalça çevresi gereklidir."
      );

      return;

    }

    if(
      waist +
      hip -
      neck <= 0
    ){

      alert(
        "Ölçümleri kontrol edin."
      );

      return;

    }

    bf =
    495 /
    (
      1.29579
      -
      0.35004 *
      (
        Math.log(
          waist +
          hip -
          neck
        )
        /
        Math.LN10
      )
      +
      0.22100 *
      (
        Math.log(height)
        /
        Math.LN10
      )
    )
    -
    450;

  }

  if(
    !isFinite(bf) ||
    bf < 0 ||
    bf > 75
  ){

    alert(
      "Ölçümler geçerli bir sonuç üretmedi. Lütfen değerleri kontrol edin."
    );

    return;

  }

  paId("fat-value").innerHTML =
  "Yaklaşık %"
  +
  bf
  .toFixed(1)
  .replace(".",",");

  paShow("fat-result");

}


/* =========================================================
   HİSSE
========================================================= */

function paStock(){

  var buy =
  paNum("stock-buy");

  var sell =
  paNum("stock-sell");

  var count =
  paNum("stock-count");

  var rate =
  paNum("stock-rate");

  if(
    buy <= 0 ||
    sell <= 0 ||
    count <= 0
  ){

    alert(
      "Lütfen alış, satış ve adet bilgilerini girin."
    );

    return;

  }

  if(rate < 0){

    alert(
      "Komisyon oranı negatif olamaz."
    );

    return;

  }

  var buyTotal =
  buy *
  count;

  var sellTotal =
  sell *
  count;

  var commission =
  (
    buyTotal +
    sellTotal
  )
  *
  rate /
  100;

  var net =
  sellTotal
  -
  buyTotal
  -
  commission;

  var percent =
  net /
  buyTotal *
  100;

  paId("stock-net").innerHTML =
  (net >= 0 ? "+" : "")
  +
  paMoney(net);

  paId("stock-net").style.color =
  net >= 0
  ?
  "#28a967"
  :
  "#e5484d";

  paId("stock-percent").innerHTML =
  (percent >= 0 ? "+" : "")
  +
  percent
  .toFixed(2)
  .replace(".",",")
  +
  "%";

  paId("stock-commission").innerHTML =
  paMoney(commission);

  paShow("stock-result");

}


/* İlk TYT alanlarını yükle */

paExamFields();


/* İyi Yol Akademi | doğrudan hesaplama aracı */
(function(){
  var tool=new URLSearchParams(window.location.search).get("tool");
  var allowed=["komisyon","indirim","uyku","maas","tytayt","tarih","bmi","kalori","su","yag","hisse"];
  if(tool&&allowed.indexOf(tool)!==-1&&typeof paOpen==="function")paOpen(tool);
})();
