import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneManager } from './js/scene/SceneManager';
import { LightManager } from './js/lights/LightManager';
import { ChristmasTree } from './js/components/ChristmasTree';
import { OrnamentManager } from './js/components/OrnamentManager';
import { EnvironmentManager } from './js/components/EnvironmentManager';

class ChristmasScene {
    constructor() {
        // 初始化场景管理器
        this.sceneManager = new SceneManager();
        this.scene = this.sceneManager.getScene();
        this.camera = this.sceneManager.getCamera();
        this.renderer = this.sceneManager.getRenderer();

        // 初始化控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;

        // 初始化灯光
        this.lightManager = new LightManager(this.scene);
        this.softLights = this.lightManager.createSoftLights();
        this.scene.add(this.softLights);
        this.lightStrings = this.lightManager.createLightStrings();
        this.scene.add(this.lightStrings);

        // 初始化圣诞树
        this.christmasTree = new ChristmasTree();
        this.scene.add(this.christmasTree.getObject());

        // 初始化装饰品
        this.ornamentManager = new OrnamentManager();
        const ornaments = this.ornamentManager.createOrnaments();
        this.christmasTree.addOrnament(ornaments);
        const star = this.ornamentManager.createStar();
        this.christmasTree.addOrnament(star);

        // 初始化环境
        this.environmentManager = new EnvironmentManager(this.scene);

        // 设置背景色
        this.scene.background = new THREE.Color(0x0a192f);

        // 开始动画循环
        this.animate();

        // 添加窗口大小调整监听器
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 更新控制器
        this.controls.update();

        // 更新装饰品动画
        this.ornamentManager.updateOrnaments();

        // 更新灯光动画
        this.lightManager.updateLightStrings(this.lightStrings);

        // 更新雪花动画
        this.environmentManager.updateSnow();

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.sceneManager.onWindowResize();
    }
}

// 创建场景实例
window.addEventListener('DOMContentLoaded', () => {
    new ChristmasScene();
}); 