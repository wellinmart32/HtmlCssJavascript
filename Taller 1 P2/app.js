const fetch = require("node-fetch");
const express = require('express');
const path = require('path');
const xml2js = require('xml2js');
const fs = require('fs');


const app = express();
const port = 3000;

let listaCategorias = [];
let listaLibros =[];
//let listaLC =[];
let listaCat = []     

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

fetch("https://dataserverdaw.herokuapp.com/libros/categoria")
    .then(response => response.json())
    .then(data => {
        const categories = Array.from(data.categories);
        
        //console.log(categories);
        for (c of  categories){
            const category = c.category
            //console.log(category)
            listaCategorias.push(category)
        }
    })

fetch("https://dataserverdaw.herokuapp.com/libros/xml")
    .then(result => {return result.text()})
    .then(str =>{
        const parser = new xml2js.Parser()        
        parser.parseStringPromise(str)        
        .then(function(res){
            //console.log(res)
            //console.log(res.bookstore.book)
            const books = Array.from(res.bookstore.book)            
            for (b of books){
                const url = b.thumbnailUrl
                const cats = b.categories                   
                for (c of cats){
                    listaCat.push(c.book)
                }
                listaLibros.push(url)                                
            } //console.log(listaCat)          
            
        })
    })
    

app.get('/', (req, res)=>{
    res.render('index.ejs')
})

app.get('/libros', (req, res)=>{
    res.render('libros.ejs', {categorias: listaCategorias, libros: listaLibros})
})

app.post('/libros', (req, res)=>{
    const cat = req.body.category;
    let newLibros=[];    
    if(cat=='ver-todo'){
        res.render('libros.ejs', {categorias: listaCategorias, libros: listaLibros})
    }else{
        for (let i = 0; i <= listaCat.length-1; i++){
            if(cat==listaCat[i][0]||cat==listaCat[i][1]||cat==listaCat[i][2]||cat==listaCat[i][3]){
                newLibros.push(listaLibros[i])
            }
        }
        res.render('libros.ejs', {categorias: listaCategorias, libros: newLibros})
    }
    //console.log(cat);    
})

app.listen(port, (req, res)=>{
    console.log('Listen in port '+port);
})