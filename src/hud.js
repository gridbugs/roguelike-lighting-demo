import {Components} from 'components';

export class Hud {
    constructor(container, weapon, message, stats, atmosphere, overlay) {
        this.container = container;
        this._weapon = weapon;
        this._message = message;
        this._stats = stats;
        this._atmosphere = atmosphere;
        this._overlay = overlay;

        this.messageChanged = false;
    }

    set stats(value) {
        this._stats.innerHTML = value;
    }

    set message(value) {
        this.messageChanged = true;
        this._message.innerHTML = value;
    }

    set weapon(value) {
        this._weapon.innerHTML = value;
    }

    set atmosphere(value) {
        this._atmosphere.innerHTML = value;
    }

    showOverlay() {
        this._overlay.style.display = 'block';
    }

    hideOverlay() {
        this._overlay.style.display = 'none';
    }

    set overlay(value) {
        this._overlay.innerHTML = value;
    }

    update(entity) {
        let health = Math.ceil(entity.get(Components.Health).value); // ceil so 0.5 doesn't look like 0
        let maxHealth = Math.floor(entity.get(Components.MaxHealth).value);
        let oxygen = Math.floor(entity.get(Components.Oxygen).value);
        let maxOxygen = Math.floor(entity.get(Components.MaxOxygen).value);
        let atmosphereCell = entity.ecsContext.atmosphere.grid.get(entity.cell.coord);
        if (atmosphereCell.venting) {
            this.atmosphere = "<span style='color:#ff0000'>Venting</span>";
        } else if (atmosphereCell.atmosphere === 0) {
            this.atmosphere = "<span style='color:#8888ff'>Vacuum</span>";
        } else {
            this.atmosphere = "<span style='color:#ffffff'>Pressurized</span>";
        }

        this.stats = `O₂:${oxygen}/${maxOxygen} HP:${health}/${maxHealth}`;

        let weaponEntity = entity.get(Components.WeaponInventory).currentWeapon;
        if (weaponEntity !== null) {
            let weapon = weaponEntity.get(Components.Weapon).weapon;
            let name = weaponEntity.get(Components.Name).value;
            if (typeof name === 'function') {
                this.weapon = name(weaponEntity);
            } else {
                this.weapon = name;
            }
        }

        if (!this.messageChanged) {
            let item = entity.cell.find(Components.Getable);
            if (item === null) {
                this.message = "";
            } else {
                this.message = `Here: ${item.get(Components.Name).value}`;
            }
        }
    }

}
