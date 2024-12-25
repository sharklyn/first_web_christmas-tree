import * as THREE from 'three';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        // 环境光
        const sceneLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(sceneLight);

        // 主光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // 补充光源
        const supplementLight = new THREE.DirectionalLight(0xffd700, 0.4);
        supplementLight.position.set(-5, 5, -5);
        this.scene.add(supplementLight);
    }

    createSoftLights() {
        const lights = new THREE.Group();
        const colors = [0xffd7aa, 0xffb6c1, 0xadd8e6];
        
        colors.forEach((color, i) => {
            const angle = (i / colors.length) * Math.PI * 2;
            const light = new THREE.PointLight(color, 0.5, 30);
            light.position.set(
                Math.cos(angle) * 10,
                8,
                Math.sin(angle) * 10
            );
            lights.add(light);
        });

        return lights;
    }

    createLightStrings() {
        const lightGroup = new THREE.Group();
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 2, 0),
            new THREE.Vector3(0, 3, 2),
            new THREE.Vector3(2, 1, -1),
            new THREE.Vector3(-1, 0, -2),
            new THREE.Vector3(1, -1, 1)
        ]);
        
        const points = curve.getPoints(50);
        const lightColors = [0xff8f8f, 0x90ee90, 0xffd700, 0xff69b4];
        
        points.forEach((point, i) => {
            const color = lightColors[i % lightColors.length];
            
            const bulbGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const bulbMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.6,
                shininess: 100
            });
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            bulb.position.copy(point);
            
            const light = new THREE.PointLight(color, 0.3, 2.0);
            light.position.copy(point);
            
            bulb.userData = {
                baseIntensity: 0.6,
                phase: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.002
            };
            
            lightGroup.add(bulb);
            lightGroup.add(light);
        });
        
        return lightGroup;
    }

    updateLightStrings(lightStrings) {
        lightStrings.children.forEach(child => {
            if (child.userData && child.userData.baseIntensity) {
                const time = Date.now();
                const intensity = child.userData.baseIntensity + 
                    Math.sin(time * child.userData.speed + child.userData.phase) * 0.3;
                child.material.emissiveIntensity = intensity;
            }
        });
    }
} 