/**
 * Created by leo on 2017/2/27.
 */
ModelLoader = function (dir, name, lights) {
    var container = document.getElementById("container");
    //scene
    var scene = new THREE.Scene();
    //camera
    var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000000);
    camera.position.set(0, 0, 10);
    //render
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor("#252a47", 1);
    container.appendChild(renderer.domElement);

    var lightParms = lights;
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.autoRotate = true;

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.offsetWidth, container.offsetHeight);

    }

    loadModel(dir, name, {x: 0, y: 0, z: 0});
    render();

    function render() {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }

    var loadFiles = 0;
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        loadFiles ++;
        console.log(item, loaded, total);
    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = 50 *loadFiles  + xhr.loaded / xhr.total * 50;
            $("#progress-bar").css("width", Math.round(percentComplete, 2) + '%');
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    function loadModel(folder, name, position) {


        var objLoader = new THREE.OBJLoader(manager);
        var mtlLoader = new THREE.MTLLoader(manager);
        mtlLoader.setBaseUrl(folder);
        mtlLoader.setPath(folder);
        mtlLoader.load(name + ".mtl", function (materials) {
            objLoader.setMaterials(materials);
            objLoader.load(folder + name + ".obj", function (object) {
                // var box = new THREE.Box3().setFromObject(object);
                //object.position.set(position.x, -box.getSize().y/2 , position.z);
                object.position.set(position.x, position.y , position.z);
                if(name != "0" && name.indexOf("p")<0 )
                {
                    var up = [
                        "11","12","13","14","15","16","17","18",
                        "21","22","23","24","25","26","27","28"
                    ];
                    var down =[
                        "31","32","33","34","35","36","37","38",
                        "41","42","43","44","45","46","47","48"
                    ];
                    var img = "";
                    if(up.indexOf(name)>-1)
                        img = "models/shangpai1.jpg";
                    else if(down.indexOf(name)>-1)
                        img = "models/xiapai.jpg";
                    var texture = new THREE.TextureLoader().load(img);
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    var material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
                    object.children[1].material  = material;
                }

                if(name.indexOf("p")>-1)
                {
                    object.children[0].material.side = THREE.FrontSide;
                    object.children[1].material.side = THREE.BackSide;
                }

                scene.add(object);
                fitCameraLight(object);
                $("#progress-bar").css("width", '100%');
                setTimeout(function () {
                    $("#loadingContainer").hide();
                }, 800);
            }, onProgress);

        });


    }


    function fitCameraLight(object3d) {
        var b = new THREE.Box3().setFromObject(object3d);
        var size = b.getSize();
        var max = size.x > size.y ? size.x : size.y;
        var offset = 0.8;
        var camera_z = (max / 2 / offset) * 2;
        // if (camera_z < 100)
        //     camera_z = 100;
        camera.position.set(0, 0, camera_z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        var lightOffset = 2;
        var params = [
            [0, size.y * lightOffset, 0],//top
            [0, -size.y * lightOffset, 0],//bottom
            [-size.x * lightOffset, 0, 0],//left
            [size.x * lightOffset, 0, 0],//right
            [0, 0, size.z * lightOffset],//front
            [0, 0, -size.z * lightOffset]//rear
        ];

        for (var i = 0; i < params.length; i++) {
            var parm = params[i];
            var light = new THREE.DirectionalLight(lightParms[i][0], lightParms[i][1]);
            light.position.set(parm[0], parm[1], parm[2]);
            scene.add(light);
            // var lightDirectHelper = new THREE.DirectionalLightHelper(light);
            // scene.add(lightDirectHelper);
        }

        //lights
        var lightAm = new THREE.AmbientLight(lightParms[6][0], lightParms[6][1]);
        scene.add(lightAm);

        controls.minDistance = size.z *0.5;
        controls.maxDistance = 10 * size.z;

    }

};