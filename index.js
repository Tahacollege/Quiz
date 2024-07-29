const express=require('express')
const app=express()
const path=require('path')
const DbConnection=require('./db')
const bodyparser=require('body-parser')
app.use('/public',express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
const cors=require('cors');
const corsConfig={
    origin:"*",
    credential:true,
    methods:["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
const cookieParser=require("cookie-parser");
var session=require('express-session');
const { ObjectId } = require('mongodb')
const MemoryStore = require('memorystore')(session);

app.use(cookieParser())
app.use(session({
    cookie: { maxAge: 86400000 },
    saveUninitialized:false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))

app.get('/',async(req,resp)=>{
    const result=await DbConnection
let collection=result.collection('users')
let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
//console.log(`topics -> ${uniqt}`)
//console.log(`uploadedby -> ${uniqup}`)
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
//console.log(qdata.length)
//resp.send(qdata[0])
    if(req.session.email){
let data=await collection.findOne({'email':req.session.email})

var uname=data.username
    }
    else{
        var uname=undefined
    }
    resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
    
})

app.post('/signup',async(req,resp)=>{
    let username=req.body.username
    let email=req.body.email
    let password=req.body.password
const result=await DbConnection
let collection=result.collection('users')
let checkdata=await collection.findOne({'email':email})
let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
if(checkdata){
    let uname='Email Already Exists!!'
    resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
}
let data=await collection.insertOne({
    'username':username,
    'email':email,
    'password':password
})
req.session.email=email
let uname=username
resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})

})

app.post('/login',async(req,resp)=>{
    const result=await DbConnection
let collection=result.collection('users')
let email=req.body.email
let password=req.body.password
let checkdata=await collection.findOne({'email':email,'password':password})
let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
if(checkdata){
    req.session.email=email
    let uname=checkdata.username
    resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
}
else{
    let uname='Invalid Credentials'
    resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
}
})
app.get('/createquiz',async(req,resp)=>{
    let result=await DbConnection
    if(req.session.email){
        let collection=result.collection('users')
        let checkdata=await collection.findOne({'email':req.session.email}) 
        let collection2=result.collection('questions')
        let uname=checkdata.username
    resp.render('createquiz',{uname})
    
}
else{
        let uname='Kindly Login Or Signup To Create Quiz'
        let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}
for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
        //resp.send(qdata)
        resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
    }

    
})
app.post('/quizquesstions',async(req,resp)=>{
    let result=await DbConnection
    let questions=result.collection('questions')
    let topic=req.body.topic
    let values=Object.values(req.body)
    let key=Math.random().toString(36).slice(2)
    let val=1
    let arr=[]
    while(val<values.length){
    var question=values[val]
    var val1=values[val+1]
    var val2=values[val+2]
    var val3=values[val+3]
    var val4=values[val+4]
    var val5=values[val+5]
    arr.push(question)
    arr.push(val1)
    arr.push(val2)
    arr.push(val3)
    arr.push(val4)
    arr.push(val5)
   /**/
    val=val+6
}
//console.log(arr)
//console.log(` length of arr-> ${arr.length}`)
for(let i=0; i<arr.length;i=i+6){
    let data=await questions.insertOne({
        'UploadedBy':req.session.email,
        'key':key,
        'topic':topic,
        'question':arr[i],
        'val1':arr[i+1],
        'val2':arr[i+2],
        'val3':arr[i+3],
        'val4':arr[i+4],
        'Correct':arr[i+5]
    })
}
//resp.send(values)
    
    let collection=result.collection('users')
    let responses=result.collection('responses')
    let checkdata=await collection.findOne({'email':req.session.email})
    let quizques=await questions.find({}).toArray()
    let uname=checkdata.username
    let quizuploaded='Quiz Uploaded SuccessFully'
    key=[]
uinqk=[]
let questionkeys=[]
for(let q of quizques){
key.push(q.key)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
    }
}
let len=uinqk.length
var qdata=[]
var resdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    let data=await questions.findOne({'UploadedBy':req.session.email,'key':uinqk[i]})
    //console.log(data)
    if(data==null){
        continue
    }
    else{
        let rdata=await questions.find({'UploadedBy':req.session.email,'key':uinqk[i]}).toArray()
        qdata.push(rdata)
    }
    //qdata.push()
}
//console.log(qdata.length)
//resp.send(qdata[0])
    let quesdata=await questions.find({'UploadedBy':req.session.email}).toArray()
    let redata=await responses.find({'email':req.session.email}).toArray()
    //console.log(` questions and  responses ${quesdata} ${redata}`)
    let q_exists=Object.keys(quesdata).length
    let r_exists=Object.keys(redata).length
    //console.log(q_exists)
    //console.log(r_exists)
    for(let data of qdata){
        questionkeys.push(data[0].key)
        }
        //console.log(questionkeys)
        for(let k of questionkeys){
            let data=await responses.findOne({'key':k})
    //console.log(data)
    if(data==null){
        continue

    }
    else{
        let rnddata=await responses.find({'key':k}).toArray()
        resdata.push(rnddata)
    }
        }
        let rd=resdata[0]
        let rd2=resdata[1]
        let rd3=resdata[2]
        let rd4=resdata[3]
        let rd5=resdata[4]
        let rd6=resdata[5]
        let rd7=resdata[6]
        let rd8=resdata[7]
        if(resdata[0]==undefined){
            rd=undefined
            }
        if(resdata[1]==undefined){
            rd2=undefined
            }
        if(resdata[2]==undefined){
            rd3=undefined
            }
            if(resdata[3]==undefined){
                rd4=undefined
                }
                if(resdata[4]==undefined){
                    rd5=undefined
                    }
                    if(resdata[5]==undefined){
                        rd6=undefined
                        }
                        if(resdata[6]==undefined){
                            rd7=undefined
                            }
                            if(resdata[7]==undefined){
                                rd8=undefined
                                }
    if(q_exists!=0 && r_exists!=0){
       // console.log(` questions and responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(q_exists==0 ){
        quesdata="no data"
        console.log(`no questions but  responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(r_exists==0 && q_exists!=0){
        redata="no data"
        
        console.log(` questions but no responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else{
        console.log(`no questions and no responses ${quesdata} ${redata}`)
        quesdata="no data"
        redata="no data"
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
//resp.render('responses',{uname,quizuploaded})

  //  resp.render('responses')
    //console.log(values.length)
})

app.post('/attendquiz',async(req,resp)=>{
    let userkey=req.body.key
    let quizkey=req.body.quizkey
    const result=await DbConnection
let collection=result.collection('users')
let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
//console.log(`userkey-> ${userkey}`)
//console.log(`key -> ${quizkey}`)
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
//console.log(qdata.length)
//resp.send(qdata[0])
    if(req.session.email){
var data=await collection.findOne({'email':req.session.email})
var uname=data.username
if(userkey!=quizkey){
    var uname='Invalid Key'
        resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
}
else{
    let questions=await collection2.find({'key':userkey}).toArray()
    resp.render('attendquiz',{uname,data,questions})
}
    }
    else{
        var uname='Kindly Login Or Signup To Take Quiz'
        resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
    }
    
    
})
app.get("/viewquiz",async(req,resp)=>{
    let quizkey=req.query.key
    let updated=undefined
    const result=await DbConnection
let collection=result.collection('users')
let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
//console.log(`userkey-> ${userkey}`)
//console.log(`key -> ${quizkey}`)
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
//console.log(qdata.length)
//resp.send(qdata[0])
    if(req.session.email){
var data=await collection.findOne({'email':req.session.email})
var uname=data.username
    let questions=await collection2.find({'key':quizkey}).toArray()
    resp.render('viewquiz',{uname,data,questions,updated})
    }
})

app.post("/submitanswers",async(req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('responses')
    let collection2=result.collection('users')
    let questions=result.collection('questions')
    let responses=result.collection('responses')
    let quizques=await questions.find({}).toArray()
    let answers=Object.values(req.body)
    let username=req.body.username
    let email=req.body.email
    let enrollnum=req.body.enrollnum
    let topic=req.body.topic
    let key=req.body.quizkey
    answers.shift()
    answers.shift()
    answers.shift()
    answers.shift()
    answers.shift()
    let data=await collection.insertOne({
        'username':username,
        'email':email,
        'enrollnum':enrollnum,
        'key':key,
        'answers':answers,
        'topic':topic
    })
    let quizuploaded='Response Stored'
    let udata=await collection2.findOne({'email':req.session.email})
    let uname=udata.username
    key=[]
uinqk=[]
let questionkeys=[]
for(let q of quizques){
key.push(q.key)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
    }
}
let len=uinqk.length
var qdata=[]
var resdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    let data=await questions.findOne({'UploadedBy':req.session.email,'key':uinqk[i]})
    //console.log(data)
    if(data==null){
        continue
    }
    else{
        let rdata=await questions.find({'UploadedBy':req.session.email,'key':uinqk[i]}).toArray()
        qdata.push(rdata)
    }
    //qdata.push()
}
//console.log(qdata.length)
//resp.send(qdata[0])
    let quesdata=await questions.find({'UploadedBy':req.session.email}).toArray()
    let redata=await responses.find({'email':req.session.email}).toArray()
    //console.log(` questions and  responses ${quesdata} ${redata}`)
    let q_exists=Object.keys(quesdata).length
    let r_exists=Object.keys(redata).length
    //console.log(q_exists)
    //console.log(r_exists)
    for(let data of qdata){
        questionkeys.push(data[0].key)
        }
        //console.log(questionkeys)
        for(let k of questionkeys){
            let data=await responses.findOne({'key':k})
    //console.log(data)
    if(data==null){
        continue

    }
    else{
        let rnddata=await responses.find({'key':k}).toArray()
        resdata.push(rnddata)
    }
        }
        let rd=resdata[0]
        let rd2=resdata[1]
        let rd3=resdata[2]
        let rd4=resdata[3]
        let rd5=resdata[4]
        let rd6=resdata[5]
        let rd7=resdata[6]
        let rd8=resdata[7]
        if(resdata[0]==undefined){
            rd=undefined
            }
        if(resdata[1]==undefined){
            rd2=undefined
            }
        if(resdata[2]==undefined){
            rd3=undefined
            }
            if(resdata[3]==undefined){
                rd4=undefined
                }
                if(resdata[4]==undefined){
                    rd5=undefined
                    }
                    if(resdata[5]==undefined){
                        rd6=undefined
                        }
                        if(resdata[6]==undefined){
                            rd7=undefined
                            }
                            if(resdata[7]==undefined){
                                rd8=undefined
                                }
                                
    if(q_exists!=0 && r_exists!=0){
       // console.log(` questions and responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(q_exists==0 ){
        quesdata="no data"
        console.log(`no questions but  responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(r_exists==0 && q_exists!=0){
        redata="no data"
        
        console.log(` questions but no responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else{
        console.log(`no questions and no responses ${quesdata} ${redata}`)
        quesdata="no data"
        redata="no data"
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
})
app.post('/editquestions',async(req,resp)=>{
    let result=await DbConnection
    let democollection=result.collection('democollection')
    let ques=result.collection('questions')
    let collection=result.collection('users')
    var valuesarr=Object.values(req.body)
    var key=req.body.key[0]
    let quizkey=key.trim()
    let dele=await ques.deleteMany({'key':key.trim()})
    var UploadedBy=req.body.UploadedBy[0]
    var topic=req.body.topic[0]
    var questionarr=valuesarr[0]
    valuesarr.shift()
    valuesarr.shift()
    valuesarr.shift()
    valuesarr.shift()
    var optionsarr=[]
    for(let i=0;i<valuesarr.length;i++){
        optionsarr.push(valuesarr[i])
    }
    var modified_options_arr=[]
    for(let i=0;i<optionsarr.length;i++){
        modified_options_arr.push(questionarr[i])
        for(let j=0;j<5;j++){
        modified_options_arr.push(optionsarr[i][j])
        }
    }
    
    //console.log(arr.length)
    console.log(questionarr.length)
    console.log(optionsarr.length)
        for(let j=0;j<modified_options_arr.length;j=j+6){
            var val1=modified_options_arr[j+1]
            var val2=modified_options_arr[j+2]
            var val3=modified_options_arr[j+3]
            var val4=modified_options_arr[j+4]
            var correct=modified_options_arr[j+5]
            let data=await ques.insertOne({
                'UploadedBy':UploadedBy.trim(),
                'key':key.trim(),
                'topic':topic.trim(),
                'question':modified_options_arr[j].trim(),
                'val1':val1,
                'val2':val2,
                'val3':val3,
                'val4':val4,
                'Correct':correct
            })
        }
        let updated="Updated Successfully"
        let quizques=await ques.find({}).toArray()
        key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
//console.log(`userkey-> ${userkey}`)
//console.log(`key -> ${quizkey}`)
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await ques.find({'key':uinqk[i]}).toArray())
}
//console.log(qdata.length)
//resp.send(qdata[0])
    if(req.session.email){
var data=await collection.findOne({'email':req.session.email})
var uname=data.username
    let questions=await ques.find({'key':quizkey}).toArray()
    resp.render('viewquiz',{uname,data,questions,updated})
    }
   
    //resp.send(modified_options_arr)
})

app.get("/userportal",async(req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('users')
    let questions=result.collection('questions')
    let responses=result.collection('responses')
    let quizuploaded=undefined
    let quizques=await questions.find({}).toArray()
key=[]
uinqk=[]
let questionkeys=[]
for(let q of quizques){
key.push(q.key)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
    }
}
let len=uinqk.length
var qdata=[]
var resdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    let data=await questions.findOne({'UploadedBy':req.session.email,'key':uinqk[i]})
    //console.log(data)
    if(data==null){
        continue
    }
    else{
        let rdata=await questions.find({'UploadedBy':req.session.email,'key':uinqk[i]}).toArray()
        qdata.push(rdata)
    }
    //qdata.push()
}
//console.log(qdata.length)
//resp.send(qdata[0])
    let udata=await collection.findOne({'email':req.session.email})
    let quesdata=await questions.find({'UploadedBy':req.session.email}).toArray()
    let redata=await responses.find({'email':req.session.email}).toArray()
    let uname=udata.username
    //console.log(` questions and  responses ${quesdata} ${redata}`)
    let q_exists=Object.keys(quesdata).length
    let r_exists=Object.keys(redata).length
    //console.log(q_exists)
    //console.log(r_exists)
    for(let data of qdata){
        questionkeys.push(data[0].key)
        }
        //console.log(questionkeys)
        for(let k of questionkeys){
            let data=await responses.findOne({'key':k})
    //console.log(data)
    if(data==null){
        continue

    }
    else{
        let rnddata=await responses.find({'key':k}).toArray()
        resdata.push(rnddata)
    }
        }
        let rd=resdata[0]
        let rd2=resdata[1]
        let rd3=resdata[2]
        let rd4=resdata[3]
        let rd5=resdata[4]
        let rd6=resdata[5]
        let rd7=resdata[6]
        let rd8=resdata[7]
        if(resdata[0]==undefined){
            rd=undefined
            }
        if(resdata[1]==undefined){
            rd2=undefined
            }
        if(resdata[2]==undefined){
        rd3=undefined
        }
        if(resdata[3]==undefined){
            rd4=undefined
            }
            if(resdata[4]==undefined){
                rd5=undefined
                }
                if(resdata[5]==undefined){
                    rd6=undefined
                    }
                    if(resdata[6]==undefined){
                        rd7=undefined
                        }
                        if(resdata[7]==undefined){
                            rd8=undefined
                            }
                            
        
    if(q_exists!=0 && r_exists!=0){
        //console.log(` questions and responses ${quesdata} ${redata}`)
        console.log(resdata[1])
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(q_exists==0 ){
        quesdata="no data"
        console.log(`no questions but  responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else if(r_exists==0 && q_exists!=0){
        redata="no data"
        
        console.log(` questions but no responses ${quesdata} ${redata}`)
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
    else{
        console.log(`no questions and no responses ${quesdata} ${redata}`)
        quesdata="no data"
        redata="no data"
        resp.render('responses',{uname,quizuploaded,quesdata,redata,qdata,rd,rd2,rd3,rd4,rd5,rd6,rd7,rd8})
    }
})
app.get("/viewresult",async(req,resp)=>{
    let result=await DbConnection
    let id=req.query.id
    let responses=result.collection('responses')
    let question=result.collection('questions')
    let data=await responses.findOne({'_id':new ObjectId(id)})
    let key=data.key
    let questions=await question.find({'key':key}).toArray()
    //console.log(key)
    answers=[]
    Correct=[]
    qs=[]
    for(let ds of data.answers){
        answers.push(ds)
    }
    for(let ds of questions){
        Correct.push(ds.Correct)
        qs.push(ds.question)
    }
    
var uname=data.username
    resp.render('viewresult',{uname,data,questions,qs,answers,Correct})
    
})

app.get('/logout',async(req,resp)=>{
    req.session.email=undefined
    let result=await DbConnection
    let uname="Loged out successfully"
    let collection2=result.collection('questions')
let quizques=await collection2.find({}).toArray()
key=[]
topic=[]
uploader=[]
uinqk=[]
uniqt=[]
uniqup=[]
for(let q of quizques){
key.push(q.key)
topic.push(q.topic)
uploader.push(q.UploadedBy)
}

for(let i=0;i<key.length;i++){
    if(key[i]==key[i+1] && topic[i]==topic[i+1] && uploader[i]==uploader[i+1]){
        continue
    }
    else{
        uinqk.push(key[i])
        uniqt.push(topic[i])
        uniqup.push(uploader[i])
    }
}
let len=uinqk.length
var qdata=[]
for(let i=0;i<len;i++){
    //console.log(`${i} key -> ${uinqk[i]}`)
    qdata.push(await collection2.find({'key':uinqk[i]}).toArray())
}
    resp.render('index',{uname,qdata,uniqt,uniqup,uinqk})
})
app.listen(5000)
