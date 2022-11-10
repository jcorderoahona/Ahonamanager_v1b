const conn = require("../../database/conexion");
var PDF = require('pdfkit');
const fs = require('fs');
const doc = require("pdfkit");
const moment = require("moment")

function buildPDF(clienteInfo,Products,DesdeCliente){
    console.log("products",Products)
    var spanishFormatDate = spanishDate();
    var fecha = new Date().toISOString().slice(0, 10);
    var orderId = insertOrder(clienteInfo.Nombre,fecha,clienteInfo.Direccion,DesdeCliente)
    orderId.then(function(result){
        return result;
    }).then(function(id){
        const doc = new PDF();
        writeHeader(doc,id);
        clientData(doc,clienteInfo,spanishFormatDate);
        writeProduct(doc,Products);
        doc.end();
        doc.pipe(fs.createWriteStream(`./pdf/test${id}.pdf`));
        return id;
    })
    return orderId.then((result) => {
        return result});
};

function writeHeader(doc,orderId) {
        doc.fontSize(11).font('./fonts/Arial-Bold.ttf').fillColor('red').text('AHONA LOGISTICS SPA', 110, 80)
        .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text('Giro: COMP,VTA,IMP Y EXP DE TODA CLASE DE ', 110, 100)
        .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text('INSUMOS MÉDICOS DE LABOR Y CLÍNICO ', 110, 110)
        .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text('CERRO EL PLOMO 5931 OF 308 PS3 - Las Condes ', 110, 120)
        .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text('Email : grupo_ct3@gglobal.cl Telefono : 229282200 ', 110, 130)
        

        .lineWidth(2).rect(350, 60, 250, 100).strokeColor('red').stroke()
        .fontSize(11).font('./fonts/Arial-Bold.ttf').fillColor('red').text('R.U.T.:77.398.633-9',430,70)
        .fontSize(11).font('./fonts/Arial-Bold.ttf').fillColor('red').text('SOLICITUD DE PEDIDO',425,100,{lineBreak:false})
        .fontSize(11).font('./fonts/Arial-Bold.ttf').fillColor('red').text('ELECTRONICA',440,110)
        .fontSize(11).font('./fonts/Arial-Bold.ttf').fillColor('red').text(`Nº${orderId}`,455,140) // temporal
};

function clientData(doc,cliente,date){
    doc.fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`SEÑOR(ES): ${cliente.Nombre}`, 30, 170)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`RUT: ${cliente.IdCliente}`, 30, 185)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`GIRO: ${cliente.Nombre}`, 30, 200)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`Fecha Emision: ${date}`, 350, 200)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`DIRECCION: ${cliente.Direccion}`, 30, 215)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`COMUNA: ${cliente.Comuna}`, 30, 230)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`CIUDAD: ${cliente.Ciudad}`, 180, 230)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text(`CONTACTO: ${cliente.IdCliente}`, 30, 245)
    .fontSize(8).font('./fonts/Arial-MT.ttf').fillColor('#00008B').text('Tipo Traslado: Otros Traslados No Venta', 30, 260)
    .lineWidth(0.01).rect(27,165,320,110).strokeColor('black').stroke()
};
function writeTotalPrice(doc,price,iva,imp,total,color,y,x,x2,width) {
    doc.fontSize(8).font('./fonts/Arial-MT.ttf').fill(color).text(price, x,y,{ 
        width:60,
        align: 'center' 
    })
    .text(iva,x,y+15,{ 
        width:60,
        align: 'center'
    })
    .text(imp,x2,y+30,{
        width:width,
        align: 'center'
    })
    .text(total,x,y+45,{ 
        width:60,
        align: 'center'
    })
}
function productTable(doc,y,c1,c2,c3,c4,c5,c6,c7,color){
    doc.fontSize(8).font('./fonts/Arial-MT.ttf').fill(color).text(c1, 10,y,{ //Codigo
        width:60,
        align: 'center' 
    })
    .text(c2,70, y,{//Descripcion
        width : 250,
        align : 'center'
    })
    .text(c3,300, y,{//Cantidad
        width:50,
        align : 'center'
    })
    .text(c4,360, y,{//Precio
        width : 50,
        align : 'center'
    })
    .text(c5,430, y)//ImpAdic
    .text(c6,490, y,{
        width : 50,
        align : 'center'
    })//Desc
    .text(c7,530, y,{//Valor
        width:100,
        align:'center'
    })
};
function writeProduct(doc,products){
    var y = 280; // donde parte el header de los productos
    var x = 430;
    productTable(doc,y,"Codigo","Descripcion","Cantidad","Precio",'%ImpAdic.','%Desc',"Valor","#00008B");
    var fecha = "";
    var Lote = "";
    var totalPrice = 0;
    var total = 0;
    for(var i = 0;i < products.length ; i ++){
        const product = products[i];
        if(product.Lote == null){
            Lote = " "
        }
        if(product.Lote != null){
            Lote = " Lote : " + product.Lote
        }
        if(product.Fecha_Ven != '0000-00-00' || product.Fecha_Ven != null){
            fecha = " Vence: " + moment(product.Fecha_Ven).utc().format('MM/DD/YYYY')
        }
        if(product.Fecha_Ven == '0000-00-00' || product.Fecha_Ven == null){
            fecha = " ";
        }
        
        
        var Desc = product.Nombre + Lote + fecha 
        const pos = y + (i + 1) * 28;
        totalPrice += product.Precio * product.Cantidad;
        var totalPriceDiscount = ((product.Precio)-((product.Descuento/100)*product.Precio))*product.Cantidad
        //console.log(totalPriceDiscount)
        productTable(doc,pos,product.Codigo,Desc,product.Cantidad, CLPrice(product.Precio * product.Cantidad) , "  ",product.Descuento, CLPrice(totalPriceDiscount),'black');
        total++
    }
    console.log("total",total)
    var lastPost = y + (total + 1 )* 28 
    writeTotalPrice(doc,"MONTO NETO ","I.V.A 19% ", "IMPUESTO ADICIONAL","TOTAL","#00008B",lastPost,x,x-40,90)
    writeTotalPrice(doc,CLPrice(totalPrice),CLPrice(totalPrice*0.19), 0 ,CLPrice(totalPrice*1.19),"black",lastPost,x+50,x+50,60)

}
function spanishDate(){
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dias = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date();

    return (dias[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear());
}

function insertOrder(Cliente,Fecha,Direccion,DesdeCliente){
    return new Promise(function(resolve, reject){
        conn.query('Insert into orden (Cliente,Fecha,Direccion,DesdeCliente) Values(?,?,?,?)',[Cliente,Fecha,Direccion,DesdeCliente],(err, results) =>{
            if(err) console.log(err);
            resolve (results.insertId);
        })
    })
}

function CLPrice(number){ 
    return new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(number)
}
module.exports = {buildPDF};