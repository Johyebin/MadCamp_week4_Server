const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017"

app.use(express.json());
mongoClient.connect(url,{ useUnifiedTopology: true },(err,client)=>{
    if(err){
        console.log("Error while connecting mongo client");
    }
    else{
        const myDb = client.db('CafeData') // mongodb내에서 CafeData라는 패키지명을 가진 db를 가져옴
        const collection = myDb.collection('cafeTable'); // myDb라는 db내에서 cafeTable이라는 컬렉션을 찾음

        // 만약 post방식으로 /push의 경로로 요청이 들어오면 해당 콜백함수를 실행함
        // 미리 지정된 포맷으로 입력넣기
        // 포스기에 연동된 카페에서 업로드하는 경우와 앱을 실행시키고 사용자가 입력폼에 입력하는 경우
        app.post('/pushProduct',(req,res)=>{
            const newProduct = {
                rowId : req.body.rowId,
                tradDate : req.body.tradDate,
                tradTime : req.body.tradTime,
                drinkTime : req.body.drinkTime,
                goodId : req.body.goodId,
                goodName : req.body.goodName,
                cafeName : req.body.cafeName,
                multipleFlag : req.body.multipleFlag
            }
        console.log("Upload Success");
        collection.insertOne(newProduct,(err,result)=>{ // 디비에다가는 입력받은 객체를 넣고, 클라이언트에게는 
         if(err == null) // 만약 error가 비어있으면 
            res.status(200).send(); // 상태코드 200 으로 set하고 이를 보냄(client에게)
          else res.status(400).send(); // 등록하려는데 만약 디비에 이미 등록되어 있으면 상태코드를 400으로 set하고 보냄
            });
        })

         // 만약 post방식으로 /pull 경로로 요청이 들어오면 해당 콜백함수를 실행함
         app.post('/pullProduct',(req,res)=>{console.log(""+req.body.tradDate);
             const query = {
                 tradDate : req.body.tradDate
             }
             // 커서를 반환하므로 모든 결과를이어붙여서 문자열로 보내야함
             collection.find(query,{_id:false}).toArray(function(err,result){
                if(result != null){ // 만약 결과가 null이 아니고
                    res.status(200).send(result);
                    console.log(result); // 200상태코드와 함께 해당 결과 객체를 보냄
                 }
                 else{
                     res.status(404).send() // 찾지못했으면 404상태코드와 함께 빈 body를 보냄(디비에 데이터가 없기 때문에)
                 }
             });
         });

         // 해당 경로로 요청이 들어오면 해당 document를 지움
         // client에서 선택되지 않은 것들 for문 사용해서 1개씩 횟수만큼 지움 // 결제 식별 아이디로
         app.post('/deleteProduct',(req,res)=>{
          const unSelected = {
            rowId : req.body.rowId
          }
      console.log("Delete Success");
      collection.deleteOne(unSelected,(err,result)=>{ 
       if(err == null) // 만약 error가 비어있으면 
          res.status(200).send(); // 상태코드 200 으로 set하고 이를 보냄(client에게)
        else res.status(400).send(); // 등록하려는데 만약 디비에 이미 등록되어 있으면 상태코드를 400으로 set하고 보냄
          });
      })

      app.post('/pushAll', (req, res)=>{
        var array = [];
        array = req.body;
        for(var i = 0; i < array.length; i++){
            const newProduct = {
                rowId : array[i].rowId,
                tradDate : array[i].tradDate,
                tradTime : array[i].tradTime,
                drinkTime : array[i].drinkTime,
                goodId : array[i].goodId,
                goodName : array[i].goodName,
                cafeName : array[i].cafeName,
                multipleFlag : array[i].multipleFlag
            }
            console.log("Upload Success");
            collection.insertOne(newProduct,(err,result)=>{ // 디비에다가는 입력받은 객체를 넣고, 클라이언트에게는 
            if(err == null) // 만약 error가 비어있으면 
                res.status(200).send(); // 상태코드 200 으로 set하고 이를 보냄(client에게)
            else res.status(400).send(); // 등록하려는데 만약 디비에 이미 등록되어 있으면 상태코드를 400으로 set하고 보냄
            });
        }
    })

    }
})
app.listen(80,()=>{
    console.log("Listening on port 80...");
})

