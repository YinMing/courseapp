'use strict';
const Restify = require('restify');
const server = Restify.createServer({
    name: "CoueseApp"
});
const fs = require('fs');
const PORT = process.env.PORT || 3000;

server.use(Restify.bodyParser());
server.use(Restify.jsonp());

var getAllCourses = () => {
    try {
        var courseString = fs.readFileSync('courses.json');
        return JSON.parse(courseString);
    } catch (e) {
        return [];
    }
};

var getCourseByCode = (courses, code) => {
    return courses.filter(c => code.toLowerCase().indexOf(c.code.toLowerCase()) >= 0);
}
var getCourseByTitle = (courses, code) => {
    return courses.filter(c => code.toLowerCase().indexOf(c.title.toLowerCase()) >= 0);
}


//POST route handler
server.post('/', (req, res, next) => {
    let {
        status,
        result
    } = req.body;

    if (status.code === 200 && result.action === 'search') {
        const {
            code
        } = result.parameters;

        var allCourses = getAllCourses();
        var courses = getCourseByCode(allCourses, code);


        if (courses.length > 0)
        {
            let responseText = `We find ${courses.length} courses`;

            res.json({
                speech: responseText,
                displayText: responseText,
                source: "courseapp-webhook"
            });
        }
        else
        {
            courses = getCourseByTitle(allCourses, code);
            if (courses.length > 0)
            {
                let responseText = `We find ${courses.length} courses`;
                res.json({
                    speech: responseText,
                    displayText: responseText,
                    source: "courseapp-webhook"
                });
            }

        }
    }
    return next();
});

server.listen(PORT, () => console.log(`CourseApp running on ${PORT}`));