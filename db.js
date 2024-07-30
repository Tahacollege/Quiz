const {MongoClient}=require('mongodb')
//const url='mongodb://localhost:27017'
const url="mongodb+srv://tcollegewala30:fOcy87YhffoTWgnJ@cluster0.qqtdpgf.mongodb.net/b.net/"
const database='QuizOrbit'
async function DbConnection(){
    const client=new MongoClient(url)
    const res=await client.connect()
    const db=res.db(database)
    return db
}
module.exports=DbConnection()