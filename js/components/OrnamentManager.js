import * as THREE from 'three';

export class OrnamentManager {
    constructor() {
        this.ornaments = new THREE.Group();
    }

    createOrnaments() {
        const ornamentColors = [
            0xff0000, // 红色
            0xffd700, // 金色
            0x4169e1, // 蓝色
            0xff69b4, // 粉色
            0x32cd32  // 绿色
        ];

        // 在树的不同位置添加装饰球
        const positions = [];
        for (let layer = 0; layer < 4; layer++) {
            const y = layer * 1.5 - 1.5;
            const radius = 3 - layer * 0.6;
            const count = 6 + layer * 2;

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                positions.push({
                    x: Math.cos(angle) * radius,
                    y: y,
                    z: Math.sin(angle) * radius
                });
            }
        }

        positions.forEach(pos => {
            const color = ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
            const ornament = this.createOrnament(color);
            ornament.position.set(pos.x, pos.y, pos.z);
            
            // 添加随机旋转
            ornament.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.ornaments.add(ornament);
        });

        return this.ornaments;
    }

    createOrnament(color) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            specular: 0xffffff
        });
        const ornament = new THREE.Mesh(geometry, material);
        ornament.castShadow = true;
        
        // 添加装饰品的动画数据
        ornament.userData = {
            basePosition: ornament.position.clone(),
            phase: Math.random() * Math.PI * 2,
            amplitude: 0.05 + Math.random() * 0.05,
            speed: 0.001 + Math.random() * 0.002
        };

        return ornament;
    }

    createStar() {
        const starGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const starPoints = 5;
        const innerRadius = 0.2;
        const outerRadius = 0.5;

        for (let i = 0; i < starPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (starPoints * 2)) * Math.PI * 2;
            vertices.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const starMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            side: THREE.DoubleSide,
            emissive: 0xffd700,
            emissiveIntensity: 0.5
        });

        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 4;
        star.rotation.z = Math.PI / 2;

        return star;
    }

    updateOrnaments() {
        this.ornaments.children.forEach(ornament => {
            if (ornament.userData.basePosition) {
                const time = Date.now();
                const newY = ornament.userData.basePosition.y +
                    Math.sin(time * ornament.userData.speed + ornament.userData.phase) *
                    ornament.userData.amplitude;
                
                ornament.position.y = newY;
                ornament.rotation.y += 0.01;
            }
        });
    }

    getOrnaments() {
        return this.ornaments;
    }
} 