enum xforce {
    dekupool = 1,
    deadpool,
    wolverine,
    magnetto
  }
  
//result = 2
  console.log(xforce.deadpool);

  enum StatusCodes {
    NotFound = 404,
    Success = 200,
    Accepted = 202,
    BadRequest = 400
  }
  //result 404
  console.log(StatusCodes.NotFound);