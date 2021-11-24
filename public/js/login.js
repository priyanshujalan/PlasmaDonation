const msg=document.querySelector("#msgs");
setTimeout(() => msg.style.display = "none", 3000);

function doIt(){

    date=new Date();
    secPast=date.getSeconds();
    minPast=date.getMinutes();
    hoursPast=date.getHours();

    minPast+=(secPast/60);
    hoursPast+=(minPast/60);

    temp= hoursPast - ((hoursPast > 12) ? 12 : 0);

    hoursHand.style.transform = "rotate("+(30 * temp)+"deg)";
    minHand.style.transform = "rotate("+(6 * minPast)+"deg)";
    secHand.style.transform = "rotate("+(6 * secPast)+"deg)";

}
