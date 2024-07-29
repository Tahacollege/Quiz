const {MongoClient}=require('mongodb')
const url='mongodb://localhost:27017'
const database='QuizOrbit'
async function DbConnection(){
    const client=new MongoClient(url)
    const res=await client.connect()
    const db=res.db(database)
    return db
}
module.exports=DbConnection()