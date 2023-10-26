class FSP{
    #errors=[]
    constructor({name,description,logo,featuredImages,size,socailMedia,address,canDeliver,contact,emails}){
        this.name=name
        this.description=description
        this.logo=logo
        this.featuredImages=featuredImages
        this.size=size
        this.socailMedia=socailMedia
        this.address=address
        this.canDeliver=canDeliver
        this.contact=contact
        this.emails=emails
    }
    #isEmpty(value){
        if(value===undefined||value==null||value==='')return true
        return false

    }
    getError(){return this.#errors}

      isValidate() {
            if(this.#isEmpty(this.name)){
                this.#errors.push("Name is required field")
            }
            if(this.#isEmpty(this.description)){
                this.#errors.push("Description is required field")
            } 
      return this.#errors.length>0?false:true
    }
}

module.exports = FSP 