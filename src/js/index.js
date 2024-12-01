import gsap from "gsap";
import Component from "./classes/Component";
import { Flip } from "gsap/all";

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
        ease: "power2.out",
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        stagger: {
          amount: 0.15,
        },
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
    const content = document.querySelector(".home__content");
    const preview = document.querySelector(".home__preview");

    const state = Flip.getState(".card");
    const flipId = element.dataset.flipId;

    content.querySelectorAll(".card").forEach((card) => {
      if (card.dataset.flipId !== flipId) {
        card.style.display = "none";
      }
    });

    preview.appendChild(element);
    element.classList.remove("card");
    element.classList.add("card-preview");

    Flip.from(state, {
      //   paused: true,
      delay: 0.2,
      duration: 0.6,
      absolute: true,
      ease: "power2.out",
      onLeave: (elements) => {
        console.log(elements);

        gsap.to(elements, {
          duration: 0.6,
          ease: "power2.out",
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          stagger: {
            amount: 0.15,
          },
        });
      },
      onComplete: () => {
        preview.style.pointerEvents = "unset";
      },
    });
  }

  addListeners() {
    this.cards.forEach((card) => {
      card.addEventListener("click", () => {
        this.flip(card);
      });
    });
  }
}

new Home();
