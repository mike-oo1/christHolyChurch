function generateDynamicEmail(link) {
    return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="background-color: aquamarine;">
    <h1 style="text-align: center;">welcome to christ holy church platform</h1>
    <p style="font-family: fantasy;text-align: center;"> you have successfully created an account</p>
    <a href="https://locakhost:8000/api/signin">click here to go to login page</a>
    <img src="../promoPrice.png" alt="" srcset="">
</body>
</html>`


}

module.exports = {generateDynamicEmail}
