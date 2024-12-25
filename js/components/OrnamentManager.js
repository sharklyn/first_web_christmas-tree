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
            const y = layer * 1.2;
            const radius = 2.5 - layer * 0.5;
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
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
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
        const starGroup = new THREE.Group();

        // 创建星星的主体（两个交叉的三角形）
        const starShape = new THREE.Shape();
        const points = [];
        const numPoints = 5;
        const innerRadius = 0.2;
        const outerRadius = 0.5;

        for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (numPoints * 2)) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push(new THREE.Vector2(x, y));
        }
        starShape.setFromPoints(points);

        const extrudeSettings = {
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.5,
            shininess: 100,
            specular: 0xffffff
        });

        const star = new THREE.Mesh(geometry, material);
        star.castShadow = true;
        star.position.y = 4.2;
        star.rotation.z = Math.PI / 2;

        // 添加发光效果
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.5,
            side: THREE.BackSide
        });

        const glowMesh = new THREE.Mesh(geometry, glowMaterial);
        glowMesh.scale.multiplyScalar(1.2);
        glowMesh.position.copy(star.position);
        glowMesh.rotation.copy(star.rotation);

        starGroup.add(star);
        starGroup.add(glowMesh);

        // 添加动画数据
        starGroup.userData = {
            rotationSpeed: 0.02,
            glowPulse: {
                phase: 0,
                speed: 0.05
            }
        };

        return starGroup;
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
            } else if (ornament.userData.rotationSpeed) {
                // 更新星星的动画
                ornament.rotation.z += ornament.userData.rotationSpeed;
                
                // 更新发光效果
                const glowMesh = ornament.children[1];
                const time = Date.now() * ornament.userData.glowPulse.speed;
                const pulseScale = 1.2 + Math.sin(time) * 0.1;
                glowMesh.scale.set(pulseScale, pulseScale, pulseScale);
                
                // 更新发光强度
                ornament.children[0].material.emissiveIntensity = 0.5 + Math.sin(time) * 0.3;
            }
        });
    }

    getOrnaments() {
        return this.ornaments;
    }
} 