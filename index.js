const { BaseKonnector, requestFactory, saveFiles, addData } = require('cozy-konnector-libs')
let request = requestFactory({ cheerio: true, jar:true})
const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const requestOri = require('request-promise')

const BASE_URL = 'http://velsvoyages.com/'

module.exports = new BaseKonnector(start)

// The start function is run by the BaseKonnector instance only when it got all the account
// information (fields). When you run this connector yourself in "standalone" mode or "dev" mode,
// the account information come from ./konnector-dev-config.json file
function start (fields) {

  /* AUTHENTIFICATION */
  return request({
    method: 'POST',
    uri: `${BASE_URL}suivi.php`,
    form: {
      'codesejour': 's2froputeaux',
      'submit': 'Valider'
    }
  })

  .then($ => {
    // Other way using saveFiles
    // const files = [
    //   {
    //     fileurl: 'http://velsvoyages.com/suivi/10631/14521-20180225-234440-0706.jpg',
    //     filename: 'photo1.jpg'
    //   }
    // ]

    // return saveFiles(files, fields)


    const imgUrl = 'http://velsvoyages.com/suivi/10631/14521-20180225-234440-0706.jpg'
    const filename = path.basename(imgUrl)

    /* ________________________________________________________________________________________________ */
    /* TEST 1 OK : on passe par une requête regénérée via request-promise plutot que via requestFactory */
    request = requestFactory({cheerio: false})
    return requestOri({
      uri:imgUrl,
      encoding: null,
      resolveWithFullResponse:true
    })
    .then(resp=>{
      fs.writeFileSync('./photo/'+'test1.jpg',resp.body)

      /* ______________________________________________________________________________________ */
      /* TEST 2 NOK : on passe par une requête via requestFactory - tout paramètres identiques  */
      return request({
        uri:imgUrl,
        encoding: null,
        resolveWithFullResponse:true
      })
      .then(resp=>{
        console.log(resp.request.headers)
        console.log(resp.statusCode)
        console.log(typeof resp.body)
        // const binary = new Buffer(resp.body, 'binary')
        // console.log(resp.body) // fait boucler sans fin ...
        // fs.writeFileSync('./photo/'+'test.jpg',binary)
        // fs.writeFile('./photo/'+'test.jpg',resp.body,()=>{})
        fs.writeFileSync('./photo/'+'test2.jpg',resp.body)
      })


    })
  })

  // /* GET ALBUMS URL */
  // .then($ => {
  //   return request({uri:'http://velsvoyages.com/suivis.php'})
  // })
  // .then($=>{
  //   const numberOfAlbums = $('#tiles-wrap').children().length
  //   const albumsUrl = []
  //   for (var i = 1; i <= numberOfAlbums; i++) {
  //     albumsUrl.push('http://velsvoyages.com/suivis.php?article=' + i)
  //   }
  //   return albumsUrl
  // })
  //
  // /* GET IMAGES URL */
  // .mapSeries( albumUrl=>{
  //   return request(albumUrl)
  //   .then($=>{
  //     console.log('loop', albumUrl)
  //     const imagesUrl = []
  //     $('#bxslider').find('a').each((i,elm)=>{
  //       const imgUrl = $(elm).attr('href')
  //       // console.log(BASE_URL + imgUrl)
  //       imagesUrl.push(BASE_URL + imgUrl)
  //     })
  //     return imagesUrl
  //   })
  //
  //   /* GET IMAGES */
  //   .mapSeries( imgUrl=>{
  //     const filename = path.basename(imgUrl)
  //     console.log(`imgUrl`, imgUrl);
  //     return request({
  //       uri:imgUrl,
  //       encoding:null,
  //       cheerio:false,
  //       json:false,
  //       jar:true,
  //       resolveWithFullResponse:true
  //     })
  //     .then(resp=>{
  //       fs.writeFileSync('./photo/'+filename,resp.body)
  //     })
  //   })
  // })
  .catch(console.log)
}
