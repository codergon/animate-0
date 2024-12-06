import gsap from "gsap";
import { Flip } from "gsap/all";
import Component from "./classes/Component";

gsap.registerPlugin(Flip);

const cards = new Component({
  element: "body",
  elements: {
    cards: ".card",
  },
});

export default class Home {
  constructor() {
    this.cards = cards.elements.cards;

    this.state = null;
    this.flipId = null;
    this.otherCards = null;
    this.otherStates = null;
    this.isFlipping = false;

    // this.setup();
    this.addListeners();
  }

  setup() {
    const tl = gsap.timeline();

    tl.from(".home__topbar", {
      delay: 0.3,
      opacity: 0,
      duration: 0.5,
      yPercent: -100,
      ease: "power2.out",
    })
      .from(this.cards, {
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      })
      .from(
        ".home__nav",
        {
          y: "80%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+=0.2"
      );
  }

  flip(element) {
    if (this.isFlipping) return;

    this.isFlipping = true;

    const content = document.querySelector(".home__content .cards");
    const preview = document.querySelector(".home__preview");

    if (!preview.classList.contains("active")) {
      const state = Flip.getState(element);
      this.flipId = element.dataset.flipId;

      // ANIMATE OUT THE OTHER CARDS
      this.otherCards = content.querySelectorAll(
        `.card:not([data-flip-id="${this.flipId}"])`
      );
      const otherStates = Flip.getState(this.otherCards);

      Flip.from(otherStates, {
        duration: 0.6,
        absolute: true,
        ease: "power2.out",
        targets: this.otherCards,
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      // ANIMATE IN THE CARD THAT WAS CLICKED
      preview.appendChild(element);
      preview.classList.add("active");

      Flip.from(state, {
        duration: 0.6,
        absolute: true,
        ease: "power2.out",
        onComplete: () => {
          this.isFlipping = false;
          preview.style.pointerEvents = "unset";
        },
      });
    } else {
      Flip.killFlipsOf(element);
      Flip.killFlipsOf(this.otherCards);

      const state = Flip.getState(element);

      //
      content.appendChild(element);

      preview.classList.remove("active");

      const otherStates = Flip.getState(this.otherCards);

      Flip.from(otherStates, {
        // paused: true,

        duration: 0.6,
        ease: "power2.out",
        targets: this.otherCards,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });

      Flip.from(state, {
        // paused: true,

        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          preview.style.pointerEvents = "none";

          const cards = content.querySelectorAll(".card");

          gsap.to(gsap.utils.toArray(cards), {
            duration: 0.1,
            clearProps: "all",
            onComplete: () => (this.isFlipping = false),
          });
        },
      });
    }
  }

  animateOut(event) {
    const card =
      event.target.tagName === "IMG"
        ? event.target.closest(".card")
        : event.target;

    this.flip(card);
  }

  addListeners() {
    this.boundAnimateOut = this.animateOut.bind(this);

    this.cards.forEach((card) => {
      card.addEventListener("click", this.boundAnimateOut, true);
    });
  }
}

new Home();
