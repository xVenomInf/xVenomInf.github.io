// AR Masks Module
// Encapsulates all procedural drawing logic for Face AR Masks

const ARMasks = {
    // Mask Types Enumeration
    Types: {
        CARNIVAL: 0,
        SUPERHERO: 1,
        CYBER: 2,
        ANONYMOUS: 3,
        TOPHAT: 4,
        VR: 5,
        PIXEL: 6,
        NONE: 7
    },

    // Main Draw Function
    draw: function (ctx, mask, index, isPersisting) {
        if (index === this.Types.NONE) return;

        ctx.save();
        ctx.translate(mask.x, mask.y);
        ctx.rotate(mask.angle);

        // Apply 3D Perspective (Faux-3D)
        const yawScale = Math.max(0.6, Math.cos(mask.yaw * 0.8));
        ctx.scale(yawScale, 1.0);

        // Opacity for persistence
        if (isPersisting) {
            ctx.globalAlpha = 0.5;
        } else {
            ctx.globalAlpha = 1.0;
        }

        const w = mask.width;
        const h = mask.height;
        const eyeDist = w / 2.8;

        switch (index) {
            case this.Types.CARNIVAL:
                this.drawCarnivalMask(ctx, w, h, eyeDist);
                break;
            case this.Types.SUPERHERO:
                this.drawSuperheroMask(ctx, w, h, eyeDist);
                break;
            case this.Types.CYBER:
                this.drawCyberMask(ctx, w, h, eyeDist);
                break;
            case this.Types.ANONYMOUS:
                this.drawAnonymousMask(ctx, w, h, eyeDist);
                break;
            case this.Types.TOPHAT:
                this.drawTopHat(ctx, w, h, eyeDist);
                break;
            case this.Types.VR:
                this.drawVRGlasses(ctx, w, h, eyeDist);
                break;
            case this.Types.PIXEL:
                this.drawPixelatedFace(ctx, w, h, eyeDist);
                break;
        }

        ctx.restore();
    },

    // --- Specific Mask Implementations ---

    drawCarnivalMask: function (ctx, w, h, eyeDist) {
        const hw = w / 2;
        const hh = h / 2;

        const gradient = ctx.createLinearGradient(-hw, -hh, hw, hh);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FF4500');
        gradient.addColorStop(1, '#800080');

        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        ctx.beginPath();
        ctx.moveTo(-hw, -hh * 0.2);
        ctx.quadraticCurveTo(-hw * 0.5, -hh, 0, -hh * 0.2);
        ctx.quadraticCurveTo(hw * 0.5, -hh, hw, -hh * 0.2);
        ctx.quadraticCurveTo(hw, hh, hw * 0.2, hh * 0.5);
        ctx.quadraticCurveTo(0, hh, -hw * 0.2, hh * 0.5);
        ctx.quadraticCurveTo(-hw, hh, -hw, -hh * 0.2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.ellipse(-eyeDist * 0.5, 0, w * 0.12, h * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(eyeDist * 0.5, 0, w * 0.12, h * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    },

    drawSuperheroMask: function (ctx, w, h, eyeDist) {
        const hw = w / 2;
        const hh = h / 2;

        ctx.fillStyle = '#D91E18';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 5;

        ctx.beginPath();
        ctx.moveTo(-hw, -hh * 0.2);
        ctx.lineTo(-hw * 0.4, -hh * 0.8);
        ctx.lineTo(0, -hh * 0.2);
        ctx.lineTo(hw * 0.4, -hh * 0.8);
        ctx.lineTo(hw, -hh * 0.2);
        ctx.lineTo(hw * 0.8, hh * 0.5);
        ctx.lineTo(0, hh * 0.2);
        ctx.lineTo(-hw * 0.8, hh * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(-eyeDist * 0.5 - w * 0.1, 0);
        ctx.lineTo(-eyeDist * 0.5, -h * 0.15);
        ctx.lineTo(-eyeDist * 0.5 + w * 0.1, 0);
        ctx.lineTo(-eyeDist * 0.5, h * 0.15);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(eyeDist * 0.5 - w * 0.1, 0);
        ctx.lineTo(eyeDist * 0.5, -h * 0.15);
        ctx.lineTo(eyeDist * 0.5 + w * 0.1, 0);
        ctx.lineTo(eyeDist * 0.5, h * 0.15);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    },

    drawCyberMask: function (ctx, w, h, eyeDist) {
        const hw = w / 2;
        const hh = h / 2;

        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(0, 20, 0, 0.7)';

        ctx.beginPath();
        ctx.moveTo(-hw, 0);
        ctx.lineTo(-hw * 0.8, -hh * 0.6);
        ctx.lineTo(-hw * 0.2, -hh * 0.6);
        ctx.lineTo(0, -hh * 0.2);
        ctx.lineTo(hw * 0.2, -hh * 0.6);
        ctx.lineTo(hw * 0.8, -hh * 0.6);
        ctx.lineTo(hw, 0);
        ctx.lineTo(hw * 0.8, hh * 0.6);
        ctx.lineTo(-hw * 0.8, hh * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-hw * 1.2, 0);
        ctx.lineTo(hw * 1.2, 0);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
        ctx.fillRect(-eyeDist * 0.5 - w * 0.1, -h * 0.1, w * 0.2, h * 0.2);
        ctx.fillRect(eyeDist * 0.5 - w * 0.1, -h * 0.1, w * 0.2, h * 0.2);
        ctx.globalCompositeOperation = 'source-over';
    },

    drawAnonymousMask: function (ctx, w, h, eyeDist) {
        const hw = w / 1.8;
        const hh = h;
        ctx.fillStyle = '#F0F0F0';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;

        const sc = w / 100;

        ctx.beginPath();
        ctx.ellipse(0, hh * 0.1, hw, hh * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 3 * sc;
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, hh * 0.2);
        ctx.quadraticCurveTo(-hw * 0.5, hh * 0.1, -hw * 0.7, hh * 0.3);
        ctx.quadraticCurveTo(-hw * 0.5, hh * 0.25, 0, hh * 0.25);
        ctx.moveTo(0, hh * 0.2);
        ctx.quadraticCurveTo(hw * 0.5, hh * 0.1, hw * 0.7, hh * 0.3);
        ctx.quadraticCurveTo(hw * 0.5, hh * 0.25, 0, hh * 0.25);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, hh * 0.5);
        ctx.lineTo(-hw * 0.1, hh * 0.8);
        ctx.lineTo(hw * 0.1, hh * 0.8);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(-hw * 0.6, hh * 0.1, w * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(hw * 0.6, hh * 0.1, w * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-eyeDist * 0.5, -hh * 0.1, w * 0.1, h * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(eyeDist * 0.5, -hh * 0.1, w * 0.1, h * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
    },

    drawTopHat: function (ctx, w, h, eyeDist) {
        const hw = w / 1.6;
        const hatY = -h * 0.9;
        const hatH = h * 1.2;

        ctx.fillStyle = '#111';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 15;

        ctx.fillRect(-hw * 0.8, hatY - hatH, hw * 1.6, hatH);

        ctx.fillStyle = '#800000';
        ctx.fillRect(-hw * 0.8, hatY - hatH * 0.2, hw * 1.6, hatH * 0.2);

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.ellipse(0, hatY, hw, h * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
    },

    drawVRGlasses: function (ctx, w, h, eyeDist) {
        const hw = w / 1.7;
        const hh = h / 1.8;

        const grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
        grad.addColorStop(0, '#222');
        grad.addColorStop(0.5, '#444');
        grad.addColorStop(1, '#111');

        ctx.fillStyle = grad;
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.roundRect(-hw, -hh * 0.6, w * 1.2, h * 1.2, 15);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-hw, 0);
        ctx.lineTo(hw, 0);
        ctx.moveTo(0, -hh);
        ctx.lineTo(0, hh);
        ctx.stroke();

        ctx.fillStyle = '#00FF00';
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(hw * 0.85, -hh * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.fillRect(-hw * 0.8, -hh * 0.1, w * 0.9, h * 0.2);
    },

    drawPixelatedFace: function (ctx, w, h, eyeDist) {
        const pixelSize = 12;
        const cols = Math.ceil(w / pixelSize);
        const rows = Math.ceil((h * 2.2) / pixelSize);
        const startX = -w / 2;
        const startY = -h * 1.2;

        ctx.globalAlpha = 0.6;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const r = 150 + Math.random() * 105;
                const g = 100 + Math.random() * 100;
                const b = 80 + Math.random() * 70;

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(startX + i * pixelSize, startY + j * pixelSize, pixelSize, pixelSize);
            }
        }
        ctx.globalAlpha = 1.0;
    }
};

window.ARMasks = ARMasks; // Export global logic
