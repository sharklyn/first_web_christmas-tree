import * as THREE from 'three';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.init();
    }

    init() {
        // 渲染器设置
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // 相机初始位置
        this.camera.position.set(0, 10, 25);
        this.camera.lookAt(0, 2, 0);

        // 窗口大小变化监听
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    add(object) {
        this.scene.add(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    updateCamera(angle) {
        const radius = 25;
        const height = 10;
        this.camera.position.x = Math.sin(angle) * radius;
        this.camera.position.z = Math.cos(angle) * radius;
        this.camera.position.y = height;
        this.camera.lookAt(0, 2, 0);
    }
} 