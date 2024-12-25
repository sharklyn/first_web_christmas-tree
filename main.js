import * as THREE from 'three';
import { SceneManager } from './js/scene/SceneManager.js';
import { LightManager } from './js/lights/LightManager.js';
import { ChristmasTree } from './js/components/ChristmasTree.js';
import { OrnamentManager } from './js/components/OrnamentManager.js';
import { EnvironmentManager } from './js/components/EnvironmentManager.js';

class ChristmasScene {
    constructor() {
        // 初始化场景管理器
        this.sceneManager = new SceneManager();
        this.scene = this.sceneManager.getScene();
        this.camera = this.sceneManager.getCamera();
        this.renderer = this.sceneManager.getRenderer();

        // 设置背景色
        this.scene.background = new THREE.Color(0x0a192f);

        // 初始化环境
        this.environmentManager = new EnvironmentManager(this.scene);

        // 初始化灯光
        this.lightManager = new LightManager(this.scene);
        this.softLights = this.lightManager.createSoftLights();
        this.scene.add(this.softLights);
        this.lightStrings = this.lightManager.createLightStrings();

        // 初始化圣诞树
        this.christmasTree = new ChristmasTree();
        this.scene.add(this.christmasTree.getObject());
        this.christmasTree.getObject().add(this.lightStrings);

        // 初始化装饰品
        this.ornamentManager = new OrnamentManager();
        const ornaments = this.ornamentManager.createOrnaments();
        this.christmasTree.addOrnament(ornaments);
        const star = this.ornamentManager.createStar();
        this.christmasTree.addOrnament(star);

        // 开始动画循环
        this.animate();

        // 添加窗口大小调整监听器
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 旋转圣诞树
        this.christmasTree.getObject().rotation.y += 0.005;

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