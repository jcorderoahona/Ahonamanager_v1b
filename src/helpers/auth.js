function authUser(req, res, next) {
    if (req.session.number && req.session.value == null) {
      res.status(403)
      return res.render('login',{
        errorMessage: 'Necesitas ingresar',
      })
    }
    next()
  }
  
function authRole(role) {
    return (req, res, next) => {
        if (req.session.value !== role) {
        res.status(401)
        return res.render('login')
        }
        next()
    }
}

module.exports = {
    authUser,
    authRole
}