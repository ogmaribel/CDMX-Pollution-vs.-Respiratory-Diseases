var url = "/dashData";

index.getElementById(inputName).attribute = "Alvaro Obregon"

console.log("hola");

//It does not accept Nan Values
d3.json(url).then(function(response) {

  //console.log(response);
  Date= response.Date;
  console.log(Date[0])

  Mun= response.Municipality;
  console.log(Mun[0]);

  CO= response.CO;
  console.log(CO[0]);

  N02= response.N02;
  console.log(N02[0]);

  PM10= response.PM10;
  console.log(PM10[0]);


});

