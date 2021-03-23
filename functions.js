const getInputValue = (task) => {
    let frame = document.getElementById('frame').value.trim().split(' ')
    let length = lengthChecker(frame)
    console.clear()

    if(length == true && task == 'bitmap'){
        analizarBitmap(getBitmap(frame),true)
    }else if(length == true && task == 'parse'){
        const bitmap = getBitmap(frame)
        const dataField = getDataField(frame)
        analizarDataField(bitmap,dataField)
        toDo("VER LA CONSOLA!!!","Presione F12, del campo 46 en adelante FALLA","success")
    }else{
        lengthError()
    }   
}

const lengthError = () => {
    removeTable()
    removeAlert()
    Alert(
        "Mensaje ISO8583 invalido: ",
        "El largo de la trama no coincide con los bytes de largo",
        "alert alert-danger alert-dismissible"
    )
}

const lengthChecker = (frame) => {
    let lengthS = ""
    const lengthArray = frame.filter((el,i) => {if(i<2) return el})
    const length = frame.length - 2
    lengthArray.forEach(el => {lengthS += el});
    const nLength = parseInt(lengthS,16)
    
    return (length == nLength)
}

const getBitmap = (frame) => {
    let campos = []
    let bitmapS = frame.filter((el,i) => {if(i>8 && i<=16) return el})
    const bitmap = bitmapS.map(element => parseInt(element,16))
    campos.push(bitmap.map((ele,i) => fieldsFilter(ele,i)))
    campos = campos.flat(2)

    //console.log(campos)
    return campos
}

const getDataField = (frame) => {
    let dataField = frame.filter((el,i) => {if(i>16) return el})
    //console.log(dataField)
    return dataField
}

const toDo = (text, secondText="No ha sido implementado aún", status="warning") => {
    removeAlert()
    removeTable()
    Alert(
        `${text}:`,
        `${secondText}`,
        `alert alert-${status} alert-dismissible`
    )
}

const analizarDataField = (bitmap,dataField) => {
   // console.log(bitmap,dataField, fields)
   let parseredFields = []
    bitmap.forEach((elBitmap) => {
        let fieldDetails = fields.find(el => el.field == elBitmap )

        let aux = fieldsSubParse(dataField,fieldDetails)
        dataField = aux.dataField
        parseredFields.push({data: aux.subField, description: aux.description})        
    })
    //console.log(parseredFields)

}

const fieldsSubParse = (dataField,fieldDetails) => {
    const aux = getLength(fieldDetails,dataField)
    const length = aux.length
    dataField = aux.dataField
    if(length != undefined){
        subField = dataField.slice(0,length)
        dataField = dataField.splice(length)
        console.log(
            `Campo ${fieldDetails.field}: ${subField} - `+
            `largo: ${length} - ${fieldDetails.description} - `+ 
            `${fieldDetails.characterType} - type: ${fieldDetails.bytesOfLength}`)
    }
    
    return {
        dataField: dataField,
        subField: subField,
        description: fieldDetails.description
    }
}

const getLength = ({field,characterType,length, bytesOfLength},dataField) => {
    let result = {dataField: dataField}
    //console.log(field, bytesOfLength)
    switch(bytesOfLength){
        case 0: {
            if(characterType == 'n'){
                if(length % 2 == 0 )
                    result.length = length/2
                else 
                result.length = (length+1)/2
            }else if(characterType == 'b'){
                if(length % 8 == 0)
                result.length = length/8
            }
            else{
                result.length = length
            }
            break
        }

        case 1: {
            result.dataField = dataField.splice(1)
            if(characterType == 'n'){
                result.length = (parseInt(dataField[0])/2)
            }else{
                result.length = parseInt(dataField[0])
            }
            break
        }

        case 2: {
            result.dataField = dataField.splice(2)
            if(characterType == 'n'){
                console.log("ERROR 2 N")
            }else{
                console.log("ERROR 2 ANS")
                console.log(field,dataField[0],dataField[1])
                result.length = undefined
            }
            break
        }

        default: {
            console.log("ERROR DEFAULT")
            result.length = undefined
        }
    }
    return result
}

const analizarBitmap = (bitmap,placeHolder) => {
    
    removeAlert()

    showList(bitmap)

    if(placeHolder){
        Alert("Calculo Exitoso!","","alert alert-success alert-dismissible")
                
    }else{
        Alert("Calculo Exitoso!","No ha ingresado un bitmap, se analizo el placeHolder","alert alert-warning alert-dismissible")
    }
    
}

const fieldsFilter = (byte, i) => {
    let campos = []
    let ind = i*8
    
    if(byte & 0b10000000) campos.push(1+ind)
    if(byte & 0b01000000) campos.push(2+ind)
    if(byte & 0b00100000) campos.push(3+ind)
    if(byte & 0b00010000) campos.push(4+ind)
    if(byte & 0b00001000) campos.push(5+ind)
    if(byte & 0b00000100) campos.push(6+ind)
    if(byte & 0b00000010) campos.push(7+ind)
    if(byte & 0b00000001) campos.push(8+ind)

    return campos
}