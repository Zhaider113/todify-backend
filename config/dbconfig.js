const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/todify_db",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useFindAndModify:false,
    // useCreateIndex:true
}).then(()=> console.log('database is connected'))
.catch((error)=> console.log('unable to connect', error))

