const mongoose =require('mongoose')

const Schema = mongoose.Schema

const sectionModel = new Schema({
    label: String,
    value: String,
    cdInd: String,
    icon: String
})

module.exports=mongoose.model('trackSection',sectionModel, 'trackSection')