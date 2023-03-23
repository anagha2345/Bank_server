const jwt = require('jsonwebtoken')
const db = require('./db.js')

// userDetails = {
//   1000: { acno: 1000, username: "anu", password: "123", balance: 0, transaction: [] },
//   1001: { acno: 1001, username: "vinz", password: "1234abc", balance: 0, transaction: [] },
//   1002: { acno: 1002, username: "karishma", password: "1234abc", balance: 0, transaction: [] },
//   1003: { acno: 1003, username: "sree", password: "1234abc", balance: 0, transaction: [] }
// }

register = (uname, acno, psw) => {
  // if (acno in userDetails) {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        status: false,
        message: 'user already present',
        statusCode: 401
      }
    }
    else {
      //create a new user object in db
      const newuser = new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })

      //save in db
      newuser.save()
      return {
        status: true,
        message: 'success',
        statusCode: 200

      }
    }
  })

}

login = (acno, psw) => {
  // if (acno in userDetails) {
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno
      const token = jwt.sign({ currentAcno }, "secretkey123")
      return {
        status: true,
        message: 'log in success',
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: 'incorrect accountnumber or password',
        statusCode: 401


      }
    }
  })



}


deposit = (acnum, password, amount) => {

  //convert string amount to number
  var amnt = parseInt(amount)
  // if (acnum in userDetails) {
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      user.balance += amnt
      user.transaction.push({ Type: "CREDIT", amount: amnt })
      user.save()
      return {
        status: true,
        message: `${amnt}is credited. your current balance is ${user.balance}`,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: 'incorrect account number or password',
        statusCode: 401,
      }
    }
  })
}
//     if (password == userDetails[acnum]["password"]) {
//       //update balance
//       userDetails[acnum]["balance"] += amnt

//       //transaction data details 
//       userDetails[acnum]["transaction"].push({ Type: "CREDIT", amount: amnt })
//       console.log(userDetails);

//       //return balance
//       return {
//         status: true,
//         message: `${amnt}is credited. your current balance is ${userDetails[acnum]["balance"]}`,
//         statusCode: 200

//       }
//     }
//     else {
//       return {
//         status: false,
//         message: 'incorrect password',
//         statusCode: 401,
//       }
//     }
//   }
//   else {
//     return {
//       status: false,
//       message: 'incorrect account number',
//       statusCode: 401,
//     }
//   }
// }
withdraw = (acnum, password, amount) => {

  //convert string amount to number
  var amnt = parseInt(amount)
  // if (acnum in userDetails) {
   return db.User.findOne({acno:acnum,password}).then(user=>{
         if(user){
          if(amnt<=user.balance){
            user.balance-=amnt
            user.transaction.push({Type: "DEBIT", amount: amnt })
            user.save()
            return {
              status: true,
              message: `${amnt}is debited. your current balance is ${user.balance}`,
              statusCode: 200
    
            }
          }
          else{
            return {
              status: false,
              message: 'insufficient balance',
              statusCode: 401,
            }
          }
         }
         else{
          return {
            status: false,
            message: 'incorrect account number or password',
            statusCode: 401,
          }
         }
    })
  }
      // if (amnt <= userDetails[acnum]["balance"]) {
      //   //update balance
      //   userDetails[acnum]["balance"] -= amnt
      //   // //transaction data details 
      //   userDetails[acnum]["transaction"].push({ Type: "DEBIT", amount: amnt })
      //   console.log(userDetails);

        //return balance
      //   return {
      //     status: true,
      //     message: `${amnt}is debited. your current balance is ${userDetails[acnum]["balance"]}`,
      //     statusCode: 200

      //   }
      // }
    //   else {
    //     return {
    //       status: false,
    //       message: 'insufficient balance',
    //       statusCode: 401,
    //     }
    //   }
    // }
    // else {
  //     return {
  //       status: false,
  //       message: 'incorrect password',
  //       statusCode: 401,
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     message: 'incorrect account number',
  //     statusCode: 401,
  //   }
  // }
// }
getTransaction = (acno) => {
 return db.User.findOne({acno}).then(data=>{
    if(data){
      return {
    status: true,
    statusCode: 200,
    transactions:data.transaction
  }
    }
  })
  
}
deleteAcc=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return{
        status:true,
        statusCode:200,
        message:'account deleted'
      }
    }
   
  })
}
module.exports = {
  register, login, deposit, withdraw, getTransaction,deleteAcc
}