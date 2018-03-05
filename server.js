const express=require('express')
const app=express()
const server=require('http').createServer(app)
const bodyparser=require('body-parser')
const io=require('socket.io').listen(server)

const expressValidator=require('express-validator')
const expressSession=require('express-session')

const mccModele=require('./modele/mccModele')

//
app.set('view engine','ejs')

const path=require('path')

//middlewares
app.use(bodyparser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'public')))
app.use(expressValidator())
app.use(expressSession({
    secret:"adelino",
    saveUninitialized:false,
    resave:false
}))
//
app.use((req,res,next)=>{
    //
    if(req.session.success === undefined)
    {
        req.session.success=true
    }
    //
    if(req.session.error === undefined)
    {
        req.session.error=undefined
    }
    //
    next()
})
//
let mcc= new mccModele()

//calculs les grandeurs
function calculs_mesures(){
    //
    mcc.process((grandeurs)=>{
        io.sockets.emit("mesures",grandeurs)
    })
}

//mesures
app.get('/',(req,res)=>{
    //console.log(modele)

    res.render('modele',{
        titre:"Modèle de la M.C.C",
        mcc_datas:mcc.getModele(),
        succes:req.session.success,
        error:req.session.error
    })
})
//post
app.post('/',(req,res)=>{
    //check
    req.check('mcc_ra','Problème de saisie pour Ra').isFloat({gt:0.0});
    req.check('mcc_c0','Problème de saisie pour C0').isFloat({gt:0.0});
    req.check('mcc_f','Problème de saisie pour f').isFloat({gt:0.0});
    req.check('mcc_uan','Problème de saisie pour Uan').isFloat({gt:0.0});
    req.check('mcc_ian','Problème de saisie pour Ian').isFloat({gt:0.0});
    req.check('mcc_ien','Problème de saisie pour Ien').isFloat({gt:0.0});
    req.check('mcc_nn','Problème de saisie pour Nn').isFloat({gt:0.0});

    let ra=parseFloat(req.body.mcc_ra)
    let c0=parseFloat(req.body.mcc_c0)
    let f=parseFloat(req.body.mcc_f)
    let uan=parseFloat(req.body.mcc_uan)
    let ian=parseFloat(req.body.mcc_ian)
    let ien=parseFloat(req.body.mcc_ien)
    let vitn=parseFloat(req.body.mcc_nn)
    //
    mcc.setModele(ra,c0,f,uan,ian,ien,vitn)

    let les_erreurs=req.validationErrors();

    if(les_erreurs){
        req.session.error=les_erreurs
        req.session.success=false
        res.redirect('/')
    }
    else{
        req.session.error=undefined
        req.session.success=true
        //
        calculs_mesures();
        //
        res.redirect('/charge')
    }
})

//modele de kapp
app.get('/charge',(req,res)=>{
    res.render('home',{
        titre:"M.C.C en charge",
    })
})

//not found
app.get('*',(req,res)=>{
    res.render('notfound',{
        titre:"Page not found"
    })
})

//listen port 8080
const PORT=process.env.PORT || 8080

server.listen(PORT,()=>{
    console.log("Serveur actif sur port: "+PORT)
})

//socket
io.sockets.on('connection',(socket)=>{
    //console.log('nouvelle connection etablie')
    //emit les reglages
    socket.on('reglages',(the_datas)=>{

        mcc.setReglages(the_datas)
        //
        calculs_mesures()
    })
})

//
process.on('SIGINT',()=>{
    io.sockets.emit('exit')
    process.exit()
})
