function initPro() {
    (function() {
        
        // Init som useful stuff for easier access (don't need 'em all)
        var   b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2AABB = Box2D.Collision.b2AABB
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2Fixture = Box2D.Dynamics.b2Fixture
            , b2World = Box2D.Dynamics.b2World
            , b2MassData = Box2D.Collision.Shapes.b2MassData
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
            , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 0);
            };
        })();

        var SCALE,
            canvas,
            ctx,
            world,
            fixDef,
            shapes = {};
        
        var init = {
            start: function(id) {

                this.defaultProperties();
                this.canvas(id);
                box2d.create.world();
                box2d.create.defaultFixture();
                
                this.surroundings.leftWall();
                this.surroundings.rightWall();
                this.surroundings.ground();
                this.callbacks();

                var i = 0;
                var total = JSON.parse(localStorage.getItem('year_viz'));
                    total = total.count_pro / 80000;
                setTimeout(function() { 
                    for (i; i < total/3; i++) {
                        var options = {};
                        var mod = i % 10;
                        if (mod < 4 && mod !=2)
                            options.radius = 0.28;
                        else if (mod < 7 && mod !=2)
                            options.radius = 0.38;
                        else
                            options.radius = 0.58;
                        add.random(options);
                    }
                }, 0);
                setTimeout(function() {
                    for (i; i < total/3; i++) {
                        var options = {};
                            var mod = i % 10;
                            if (mod < 4 && mod !=2)
                                options.radius = 0.28;
                            else if (mod < 7 && mod !=2)
                                options.radius = 0.38;
                            else
                                options.radius = 0.58;
                            add.random(options);
                    }
                }, 250);
                // On my signal: Unleash hell.
                (function hell() {
                    loop.step();
                    loop.update();
                    loop.draw();
                    requestAnimFrame(hell);
                })();
            },
            defaultProperties: function() {
                SCALE = 30;
            },
            canvas: function(id) {
                canvas = document.getElementById(id);
                ctx = canvas.getContext("2d");
            },
            surroundings: {
                rightWall: function() {
                    //Original box: 740 x 380
                    //Our box: 200 x 800
                    add.box({
                        // x: 25.7,        // 740 / 30 + 1.1
                        // y:  6.3,        // 380px / 30 / 2
                        // height: 12.6,   // 380px / 30
                        x: 7.76,        // 200px / 30 + 1.1
                        y:  13.3,        // 800px / 30 / 2
                        height: 28.7,   // 800px / 30
                        width: 2.05,
                        isStatic: true
                    });
                },
                ground: function() {
                    add.box({
                        // x: 12.3,        // 740 / 30 / 2
                        // y:  13.7,
                        // height: 2,
                        // width:24.6,     // 740 / 30
                        x: 3.3,        // 200 / 30 / 2
                        y:  20,
                        height: 1,
                        width:7,     // 200 / 30
                        rotate: -0.02,
                        isStatic: true
                    });
                },
                leftWall: function() {
                    add.box({
                        x: -1,
                        // y:  6.3,        // 380px / 30 / 2
                        // height: 12.6,   // 380px / 30
                        y:  13.3,        // 800px / 30 / 2
                        height: 28.7,   // 800px / 30
                        width:2,
                        isStatic: true
                    });
                }
            },
            callbacks: function() {

            }
        };        
         
         
        var add = {
            random: function(options) {
                var self = this;
                setTimeout(function(){
                    options = options || {};
                    self.circle(options);
                },500); 
            },
            circle: function(options) {
                var shape = new Circle(options);
                shapes[shape.id] = shape;
                box2d.addToWorld(shape);
            },
            box: function(options) {
                options.width = options.width || 0.5 + Math.random()*2;
                options.height = options.height || 0.5 + Math.random()*2;
                options.rotate = options.rotate || 0;
                var shape = new Box(options);
                shapes[shape.id] = shape;
                box2d.addToWorld(shape);
            }
        };

        var box2d = {
            addToWorld: function(shape) {
                var bodyDef = this.create.bodyDef(shape);
                var body = world.CreateBody(bodyDef);
                if (shape.radius) {
                    fixDef.shape = new b2CircleShape(shape.radius);
                } else {
                    fixDef.shape = new b2PolygonShape;
                    fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2);
                }
                body.CreateFixture(fixDef);
            },
            create: {
                world: function() {
                    world = new b2World(
                        new b2Vec2(0,30)    //gravity
                        ,true                 //allow sleep
                    );
                },
                defaultFixture: function() {
                    fixDef = new b2FixtureDef;
                    fixDef.density = 6.0;
                    fixDef.friction = 10;
                    fixDef.restitution = 0.6;
                },
                bodyDef: function(shape) {
                    var bodyDef = new b2BodyDef;
            
                    if (shape.isStatic == true) {
                        bodyDef.type = b2Body.b2_staticBody;
                    } else {
                        bodyDef.type = b2Body.b2_dynamicBody;
                    }
                    bodyDef.position.x = shape.x;
                    bodyDef.position.y = shape.y;
                    bodyDef.userData = shape.id;
                    bodyDef.angle = shape.rotate;
                
                    return bodyDef;
                }
            },
            get: {
                bodySpec: function(b) {
                    return {
                        x: b.GetPosition().x, 
                        y: b.GetPosition().y, 
                        angle: b.GetAngle(), 
                        center: {
                            x: b.GetWorldCenter().x, 
                            y: b.GetWorldCenter().y
                        }
                    };
                }
            }
        };


        var loop = {
            step: function() {
                var stepRate = 1 / 60;
                world.Step(stepRate, 10, 10);
                world.ClearForces();
            },
            update: function () {            
                for (var b = world.GetBodyList(); b; b = b.m_next) {
                    if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
                        shapes[b.GetUserData()].update(box2d.get.bodySpec(b));
                    }
                }
            },
            draw: function() {            
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (var i in shapes) {
                    shapes[i].draw();
                }
            }
        };    
        
        var helpers = {
            randomColor: function() {
                // var letters = '0123456789ABCDEF'.split(''),
                //     color = '#';
                // for (var i = 0; i < 6; i++ ) {
                //     color += letters[Math.round(Math.random() * 15)];
                // }
                return '#ffffff';//'#'+(~~(Math.random()*(1<<24))).toString(16);
            }
        };
        
        /* Shapes down here */
        
        var Shape = function(v) {
            this.id = Math.round(Math.random() * 1000000);
            this.x = v.x || Math.random();
            this.y = v.y || this.x;
            this.rotate = v.rotate || 0;
            this.angle = 0;
            // this.color = helpers.randomColor();
            this.center = { x: null, y: null };
            this.isStatic = v.isStatic || false;
            
            this.update = function(options) {
                this.angle = options.angle;
                this.center = options.center;
                this.x = options.x;
                this.y = options.y;
            };
        };
        
        var Circle = function(options) {
            Shape.call(this, options);
            this.radius = options.radius || 1;
            
            this.draw = function() {
                ctx.save();
                ctx.translate(this.x * SCALE, this.y * SCALE);
                ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
                ctx.rotate(this.rotate);
                ctx.lineWidth   = 2;
                ctx.strokeStyle = '#2f6593';
                ctx.fillStyle   = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            };
        };
        Circle.prototype = Shape;
        
        var Box = function(options) {
            Shape.call(this, options);
            this.width = options.width;
            this.height = options.height;
            this.rotate = options.rotate;
            
            this.draw = function() {
            };
        };
        Box.prototype = Shape;
        
        init.start('box2d-demo2');
    })();
}