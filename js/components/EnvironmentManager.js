import * as THREE from 'three';

export class EnvironmentManager {
    constructor(scene) {
        this.scene = scene;
        this.snowflakes = [];
        this.init();
    }

    init() {
        this.createGround();
        this.createSnow();
        this.createStars();
    }

    createGround() {
        // 创建地面
        const groundGeometry = new THREE.CircleGeometry(20, 64);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 50,
            specular: 0x444444
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 添加雪堆效果
        const snowPileCount = 20;
        for (let i = 0; i < snowPileCount; i++) {
            const radius = Math.random() * 0.5 + 0.3;
            const height = Math.random() * 0.3 + 0.2;
            
            const pileGeometry = new THREE.SphereGeometry(radius, 16, 16);
            const pileMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shininess: 30
            });
            
            const pile = new THREE.Mesh(pileGeometry, pileMaterial);
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 15 + 3;
            
            pile.position.set(
                Math.cos(angle) * distance,
                -1.5 + height/2,
                Math.sin(angle) * distance
            );
            pile.scale.y = 0.3;
            pile.receiveShadow = true;
            pile.castShadow = true;
            
            this.scene.add(pile);
        }
    }

    createSnow() {
        const snowGeometry = new THREE.BufferGeometry();
        const snowCount = 1000;
        const positions = new Float32Array(snowCount * 3);
        const velocities = new Float32Array(snowCount);

        for (let i = 0; i < snowCount; i++) {
            const i3 = i * 3;
            positions[i3] = Math.random() * 40 - 20;
            positions[i3 + 1] = Math.random() * 20;
            positions[i3 + 2] = Math.random() * 40 - 20;
            velocities[i] = Math.random() * 0.02 + 0.01;
        }

        snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const snowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const snow = new THREE.Points(snowGeometry, snowMaterial);
        this.scene.add(snow);
        this.snowflakes = {
            mesh: snow,
            velocities: velocities,
            positions: positions
        };
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            const radius = 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // 随机星星颜色
            colors[i3] = Math.random() * 0.3 + 0.7;     // R
            colors[i3 + 1] = Math.random() * 0.3 + 0.7; // G
            colors[i3 + 2] = Math.random() * 0.3 + 0.7; // B
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    updateSnow() {
        if (!this.snowflakes.mesh) return;

        const positions = this.snowflakes.mesh.geometry.attributes.position.array;
        const velocities = this.snowflakes.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= velocities[i/3]; // Y position

            // 当雪花落到地面以下时，重置到顶部
            if (positions[i + 1] < -1.5) {
                positions[i + 1] = 20;
                positions[i] = Math.random() * 40 - 20;   // X
                positions[i + 2] = Math.random() * 40 - 20; // Z
            }
        }

        this.snowflakes.mesh.geometry.attributes.position.needsUpdate = true;
    }
} 