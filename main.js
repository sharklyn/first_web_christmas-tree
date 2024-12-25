import * as THREE from 'three';

// 场景设置
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000921);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 相机位置
camera.position.z = 15;
camera.position.y = 5;

// 创建圣诞树函数
function createTree() {
    const treeGeometry = new THREE.ConeGeometry(4, 8, 32);
    const treeMaterial = new THREE.MeshPhongMaterial({
        color: 0x146b3a,
        transparent: true,
        opacity: 0.8,
        shininess: 30
    });
    const tree = new THREE.Mesh(treeGeometry, treeMaterial);
    return tree;
}

// 创建装饰球函数
function createOrnaments() {
    const ornaments = new THREE.Group();
    const colors = [0xfe676e, 0xffbf73, 0x3978a4];
    
    for(let i = 0; i < 30; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            shininess: 100
        });
        const ornament = new THREE.Mesh(geometry, material);
        
        // 随机位置
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * 3;
        const height = Math.random() * 7 - 3;
        
        ornament.position.x = radius * Math.cos(theta);
        ornament.position.z = radius * Math.sin(theta);
        ornament.position.y = height;
        
        ornaments.add(ornament);
    }
    return ornaments;
}

// 创建星星函数
function createStar() {
    const starGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const starMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdf99,
        shininess: 100
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.y = 4;
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
            speed: Math.random() * 0.02 + 0.01
        };
        snow.add(snowflake);
    }
    return snow;
}

// 添加灯光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 添加物体到场景
const tree = createTree();
scene.add(tree);

const ornaments = createOrnaments();
scene.add(ornaments);

const star = createStar();
scene.add(star);

const snow = createSnow();
scene.add(snow);

// 动画循环
let angle = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转视角
    angle += 0.005;
    camera.position.x = Math.sin(angle) * 15;
    camera.position.z = Math.cos(angle) * 15;
    camera.lookAt(0, 0, 0);
    
    // 雪花动画
    snow.children.forEach(snowflake => {
        snowflake.position.y -= snowflake.userData.speed;
        if(snowflake.position.y < -10) {
            snowflake.position.y = 30;
        }
    });
    
    // 星星闪烁
    star.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    star.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    star.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    
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