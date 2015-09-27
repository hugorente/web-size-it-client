module.exports = function(app)
{
     app.get('/',function(req,res){
        var size = 0;
        res.render('index.html', {
            size: size
        })
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });
}