import * as THREE from 'three';

// 场景设置
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 相机位置
camera.position.z = 15;
camera.position.y = 5;

// 创建渐变背景
const bgTexture = new THREE.CanvasTexture(createGradientCanvas());
scene.background = bgTexture;

// 创建渐变背景画布
function createGradientCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#0a1a3f');   // 深蓝色
    gradient.addColorStop(0.5, '#1e3f6f'); // 中蓝色
    gradient.addColorStop(1, '#2a4f8f');   // 浅蓝色
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 512);
    return canvas;
}

// 创建星空背景
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for(let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = Math.random() * 100;
        const z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    return new THREE.Points(starsGeometry, starsMaterial);
}

// 创建月亮
function createMoon() {
    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        shininess: 0
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(50, 30, -100);
    return moon;
}

// 创建地面
function createGround() {
    const groundGroup = new THREE.Group();

    // 创建主要的雪地平面
    const groundGeometry = new THREE.CircleGeometry(50, 64);
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 20,
        specular: 0x555555
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4;
    ground.receiveShadow = true;

    // 创建雪地纹理层
    const snowGeometry = new THREE.PlaneGeometry(100, 100, 128, 128);
    const vertices = snowGeometry.attributes.position.array;
    
    // 添加随机起伏，模拟雪地表面
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.random() * 0.3; // 高度随机变化
    }
    
    const snowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 30,
        specular: 0x444444,
        transparent: true,
        opacity: 0.9,
        flatShading: true
    });
    
    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
    snow.rotation.x = -Math.PI / 2;
    snow.position.y = -3.9;
    snow.receiveShadow = true;

    // 添加额外的雪堆
    const snowPiles = [];
    for (let i = 0; i < 20; i++) {
        const radius = Math.random() * 2 + 1;
        const height = Math.random() * 0.5 + 0.2;
        const segments = Math.floor(Math.random() * 8) + 8;
        
        const pileGeometry = new THREE.ConeGeometry(radius, height, segments);
        const pileMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 20,
            specular: 0x555555
        });
        
        const pile = new THREE.Mesh(pileGeometry, pileMaterial);
        pile.position.x = (Math.random() - 0.5) * 40;
        pile.position.y = -3.8;
        pile.position.z = (Math.random() - 0.5) * 40;
        pile.rotation.y = Math.random() * Math.PI;
        pile.scale.x = Math.random() * 0.5 + 0.5;
        pile.scale.z = Math.random() * 0.5 + 0.5;
        pile.receiveShadow = true;
        pile.castShadow = true;
        
        snowPiles.push(pile);
    }

    groundGroup.add(ground);
    groundGroup.add(snow);
    snowPiles.forEach(pile => groundGroup.add(pile));

    return groundGroup;
}

// 创建圣诞树函数
function createTree() {
    const treeGroup = new THREE.Group();
    
    // 创建树干
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({
        color: 0x3d1f00,
        shininess: 5
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -3;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // 创建树冠
    const treeColors = [
        0x0d5a1e, // 深绿
        0x0f6d23, // 中绿
        0x117a28  // 浅绿
    ];

    // 从底部到顶部创建4层锥体
    const layers = [
        { radius: 3.5, height: 3.0, y: -1.5 },
        { radius: 2.8, height: 2.5, y: 0.5 },
        { radius: 2.2, height: 2.0, y: 2.0 },
        { radius: 1.5, height: 1.5, y: 3.2 }
    ];

    layers.forEach((layer, i) => {
        const geometry = new THREE.ConeGeometry(
            layer.radius,
            layer.height,
            32,
            1,
            false,
            Math.PI * (i % 2 ? 0.1 : 0) // 交替旋转，增加层次感
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: treeColors[i % treeColors.length],
            shininess: 5,
            flatShading: true
        });

        const cone = new THREE.Mesh(geometry, material);
        cone.position.y = layer.y;
        cone.castShadow = true;
        cone.receiveShadow = true;

        // 给每层添加细微的随机旋转
        cone.rotation.y = Math.random() * Math.PI * 0.1;
        
        treeGroup.add(cone);
    });

    return treeGroup;
}

// 创建装饰球函数
function createOrnaments() {
    const ornaments = new THREE.Group();
    const colors = [
        0xff0000, // 红色
        0xffd700, // 金色
        0x4169e1, // 蓝色
        0xff1493, // 粉色
        0xffa500  // 橙色
    ];
    
    // 创建大小不同的装饰球
    const sizes = [0.3, 0.2, 0.15];
    let count = 0;
    
    sizes.forEach(size => {
        for(let i = 0; i < 15; i++) {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                metalness: 0.8,
                roughness: 0.2,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2,
                envMapIntensity: 1.0
            });
            
            const ornament = new THREE.Mesh(geometry, material);
            
            // 使用螺旋分布，但添加随机偏移
            const angle = (count / 30) * Math.PI * 6;
            const radius = 2.5 - (count / 30) * 1.5;
            const height = 4 - (count / 30) * 8;
            
            ornament.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
            ornament.position.z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
            ornament.position.y = height + (Math.random() - 0.5) * 0.5;
            
            // 添加随机旋转
            ornament.rotation.x = Math.random() * Math.PI;
            ornament.rotation.y = Math.random() * Math.PI;
            ornament.rotation.z = Math.random() * Math.PI;
            
            // 添加装饰球顶部的挂钩
            const hookGeometry = new THREE.TorusGeometry(0.03, 0.01, 16, 32);
            const hookMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xcccccc,
                metalness: 0.9,
                roughness: 0.2
            });
            const hook = new THREE.Mesh(hookGeometry, hookMaterial);
            hook.position.y = size + 0.03;
            hook.rotation.x = Math.PI / 2;
            ornament.add(hook);
            
            ornament.castShadow = true;
            ornament.receiveShadow = true;
            
            // 添加动画数据
            ornament.userData = {
                originalPosition: ornament.position.clone(),
                swingPhase: Math.random() * Math.PI * 2,
                swingSpeed: 0.0005 + Math.random() * 0.0005
            };
            
            ornaments.add(ornament);
            count++;
        }
    });
    
    return ornaments;
}

// 创建礼物盒
function createPresents() {
    const presents = new THREE.Group();
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];
    const positions = [
        [-2, -3.5, -2], [2, -3.5, -2], [0, -3.5, 2],
        [-1.5, -3.5, 1], [1.5, -3.5, 0]
    ];

    positions.forEach((pos, i) => {
        const size = Math.random() * 0.5 + 0.8;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhongMaterial({
            color: colors[i],
            shininess: 30
        });
        const present = new THREE.Mesh(geometry, material);
        present.position.set(...pos);
        present.rotation.y = Math.random() * Math.PI * 2;
        present.castShadow = true;
        presents.add(present);

        // 添加礼物丝带
        const ribbonGeometry = new THREE.BoxGeometry(size * 1.1, size * 0.1, size * 0.1);
        const ribbonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 50
        });
        const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        const ribbon2 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon1.position.set(...pos);
        ribbon2.position.set(...pos);
        ribbon2.rotation.y = Math.PI / 2;
        ribbon1.castShadow = true;
        ribbon2.castShadow = true;
        presents.add(ribbon1, ribbon2);
    });

    return presents;
}

// 创建星星
function createStar() {
    const starGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const starMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdf99,
        shininess: 100,
        emissive: 0xffdf99,
        emissiveIntensity: 0.5
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 5;
    star.castShadow = true;
    return star;
}

// 创建雪花
function createSnow() {
    const snow = new THREE.Group();
    const snowGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const snowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    for(let i = 0; i < 200; i++) {
        const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
        snowflake.position.x = Math.random() * 40 - 20;
        snowflake.position.y = Math.random() * 40 - 10;
        snowflake.position.z = Math.random() * 40 - 20;
        snowflake.userData = {
            speed: Math.random() * 0.02 + 0.01,
            rotationSpeed: Math.random() * 0.02 - 0.01
        };
        snow.add(snowflake);
    }
    return snow;
}

// 添加柔和的环境光
const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
scene.add(ambientLight);

// 添加月光
const moonLight = new THREE.DirectionalLight(0x9999ff, 0.8);
moonLight.position.set(10, 10, 10);
moonLight.castShadow = true;
scene.add(moonLight);

// 添加温柔的点光源
function createSoftLights() {
    const lights = new THREE.Group();
    const colors = [0xffd7aa, 0xffb6c1, 0xadd8e6];
    
    colors.forEach((color, i) => {
        const angle = (i / colors.length) * Math.PI * 2;
        const light = new THREE.PointLight(color, 0.6, 50);
        light.position.set(
            Math.cos(angle) * 15,
            8,
            Math.sin(angle) * 15
        );
        lights.add(light);
    });

    return lights;
}

// 创建圣诞灯串
function createLightStrings() {
    const lightGroup = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(0, 3, 2),
        new THREE.Vector3(2, 1, -1),
        new THREE.Vector3(-1, 0, -2),
        new THREE.Vector3(1, -1, 1)
    ]);
    
    const points = curve.getPoints(50);
    const lightColors = [0xff0000, 0x00ff00, 0xffff00, 0xff00ff];
    
    points.forEach((point, i) => {
        const light = new THREE.PointLight(
            lightColors[i % lightColors.length],
            0.5,
            3
        );
        light.position.copy(point);
        
        const bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const bulbMaterial = new THREE.MeshPhongMaterial({
            color: lightColors[i % lightColors.length],
            emissive: lightColors[i % lightColors.length],
            emissiveIntensity: 0.5
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.copy(point);
        
        lightGroup.add(light);
        lightGroup.add(bulb);
        
        // 添加灯泡的闪烁动画数据
        bulb.userData = {
            baseIntensity: 0.5,
            phase: Math.random() * Math.PI * 2
        };
    });
    
    return lightGroup;
}

// 添加物体到场景
const stars = createStars();
scene.add(stars);

const moon = createMoon();
scene.add(moon);

const ground = createGround();
scene.add(ground);

const tree = createTree();
scene.add(tree);

const ornaments = createOrnaments();
scene.add(ornaments);

const presents = createPresents();
scene.add(presents);

const star = createStar();
scene.add(star);

const snow = createSnow();
scene.add(snow);

const softLights = createSoftLights();
scene.add(softLights);

const lightStrings = createLightStrings();
scene.add(lightStrings);

// 动画循环
let angle = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转视角（降低速度）
    angle += 0.001;
    camera.position.x = Math.sin(angle) * 15;
    camera.position.z = Math.cos(angle) * 15;
    camera.lookAt(0, 0, 0);
    
    // 雪花动画
    snow.children.forEach(snowflake => {
        snowflake.position.y -= snowflake.userData.speed;
        snowflake.rotation.y += snowflake.userData.rotationSpeed;
        if(snowflake.position.y < -10) {
            snowflake.position.y = 30;
        }
    });
    
    // 星星闪烁（更温柔的效果）
    const starPulse = Math.sin(Date.now() * 0.002) * 0.1 + 1;
    star.scale.set(starPulse, starPulse, starPulse);
    star.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.2;
    
    // 装饰球摆动效果
    ornaments.children.forEach(ornament => {
        const time = Date.now();
        const originalPos = ornament.userData.originalPosition;
        const phase = ornament.userData.swingPhase;
        const speed = ornament.userData.swingSpeed;
        
        // 计算摆动位置
        ornament.position.x = originalPos.x + Math.sin(time * speed + phase) * 0.1;
        ornament.position.z = originalPos.z + Math.cos(time * speed + phase) * 0.1;
        
        // 添加轻微的旋转
        ornament.rotation.x += Math.sin(time * speed) * 0.001;
        ornament.rotation.z += Math.cos(time * speed) * 0.001;
    });
    
    // 灯串闪烁效果
    lightStrings.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
            const intensity = child.userData.baseIntensity + 
                Math.sin(Date.now() * 0.003 + child.userData.phase) * 0.3;
            child.material.emissiveIntensity = intensity;
        } else if (child instanceof THREE.PointLight) {
            const intensity = 0.5 + Math.sin(Date.now() * 0.003 + i * 0.5) * 0.3;
            child.intensity = intensity;
        }
    });
    
    renderer.render(scene, camera);
}

// 响应窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 开始动画
animate(); 