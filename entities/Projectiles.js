export class Projectiles {
    constructor(positions, ranges, type) {
      this.ranges = ranges
      this.type = type
      this.projectiles = []
      const animMap = {
        "fish": "swim",
        "flame": "burn"
      }
      
      for (const position of positions) {
        this.projectiles.push(
          add([
            sprite(type, { anim: animMap[type]}),
            area({ shape: new Rect(vec2(0), 12, 12) }),
            anchor("center"),
            pos(position),
            scale(4),
            //rotate( type=== "fish" ? 90 : 0),
            state("launch", ["launch", "rotate", "fall"]),
            offscreen(),
            "projectiles",
          ])
        )
      }
    }


  
    setMovementPattern() {
      for (const [index, projectile] of this.projectiles.entries()) {
        const launch = projectile.onStateEnter("launch", async () => {
          projectile.flipY = false
          
          if (this.type === "flame" && !projectile.isOffScreen()) {
            play("fireball", { volume: 0.3 });
          }
      
          await tween(
            projectile.pos.y,
            projectile.pos.y - this.ranges[index],
            2,
            (posY) => projectile.pos.y = posY,
            easings.easeOutSine
          )
          projectile.enterState("fall")
        })
  

  
        const fall = projectile.onStateEnter("fall", async () => {
       
          projectile.flipY = true
          await tween(
            projectile.pos.y,
            projectile.pos.y + this.ranges[index],
            2,
            (posY) => (projectile.pos.y = posY),
            easings.easeOutSine
          )
          projectile.enterState("launch")
        })
  
        onSceneLeave(() => {
          launch.cancel()
          fall.cancel()
        })
      }
    }
  }