class LiferayCarousel {
	constructor(carouselElement) {
		if (!carouselElement) return;

		this.carousel = carouselElement;

		this.track = this.carousel.querySelector('.carousel-track');
		this.prevBtn = this.carousel.querySelector('.carousel-prev');
		this.nextBtn = this.carousel.querySelector('.carousel-next');
		this.dots = Array.from(this.carousel.querySelectorAll('.carousel-dot'));
		this.originalSlides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));

		this.config = {
			autoplayDelay: 6000,
			transitionSpeed: 450,
			clones: 2, 
			swipeThreshold: 50,
			clickThreshold: 5,
		};

		this.total = this.originalSlides.length;
		this.allSlides = [];
		this.virtualIndex = this.config.clones;
		this.slideWidth = 0;
		this.isMobile = false;
		this.isDragging = false;
		this.startX = 0;
		this.dragDiff = 0;

		this.autoplayTimer = null;
		this.autoplayResumeTimer = null;
		this.userInteracted = false;
		this.debounceTimer = null;
		this.jumpTimeout = null;

		this.init();
	}

	init() {
		if (this.total <= 1) {
			this.disable();
			return;
		}

		this.createClones();
		this.allSlides = Array.from(this.track.querySelectorAll('.carousel-slide'));
		this.bindEvents();
		this.updateDimensions();
		this.startAutoplay();
	}

	disable() {
		this.prevBtn?.remove();
		this.nextBtn?.remove();
		this.carousel.querySelector('.carousel-dots')?.remove();
	}

	createClones() {
		const fragBefore = document.createDocumentFragment();
		const fragAfter = document.createDocumentFragment();

		for (let i = 0; i < this.config.clones; i++) {
			const cloneEnd = this.originalSlides[i].cloneNode(true);
			const cloneStart =
				this.originalSlides[this.total - 1 - i].cloneNode(true);
			fragAfter.appendChild(cloneEnd);
			fragBefore.prepend(cloneStart);
		}

		this.track.prepend(fragBefore);
		this.track.append(fragAfter);
	}

	moveTo(index, animate = true) {
		clearTimeout(this.jumpTimeout);
		this.virtualIndex = index;

		this.track.style.transition = animate
			? `transform ${this.config.transitionSpeed}ms ease`
			: 'none';
		this.track.style.transform = `translateX(${-this.virtualIndex * this.slideWidth}px)`;

		this.updateStates();
		this.updateDots();

		if (animate) {
			this.jumpTimeout = setTimeout(() => {
				this.handleJump();
			}, this.config.transitionSpeed);
		}
		else {
			this.handleJump();
		}
	}

	handleJump() {
		if (this.virtualIndex < this.config.clones) {
			this.virtualIndex = this.total + this.virtualIndex;
		}
		else if (this.virtualIndex >= this.total + this.config.clones) {
			this.virtualIndex = this.virtualIndex - this.total;
		}

		this.track.style.transition = 'none';
		this.track.style.transform = `translateX(${-this.virtualIndex * this.slideWidth}px)`;
	}

	getRealIndex() {
		return (
			(this.virtualIndex - this.config.clones + this.total) %
			this.total
		);
	}

	updateStates() {
		const realIndex = this.getRealIndex();

		this.allSlides.forEach((slide, i) => {
			slide.classList.remove('is-active', 'is-peek');
			const slideIndex =
				(i - this.config.clones + this.total) % this.total;

			if (slideIndex === realIndex) {
				slide.classList.add('is-active');
			}

			if (!this.isMobile) {
				const prevPeek = (realIndex - 1 + this.total) % this.total;
				const nextPeek = (realIndex + 1) % this.total;
				if (slideIndex === prevPeek || slideIndex === nextPeek) {
					slide.classList.add('is-peek');
				}
			}
		});
	}

	updateDots() {
		const realIndex = this.getRealIndex();
		this.dots.forEach((dot, i) => {
			dot.classList.toggle('is-active', i === realIndex);
		});
	}

	updateDimensions() {
		this.isMobile = window.innerWidth < 768;

		const gap = this.isMobile ? 0 : 32;
		this.slideWidth = this.allSlides[0].getBoundingClientRect().width + gap;

		this.moveTo(this.virtualIndex, false);
	}

	startAutoplay() {
		if (this.autoplayTimer) clearInterval(this.autoplayTimer);
		this.autoplayTimer = setInterval(() => {
			this.moveTo(this.virtualIndex + 1);
		}, this.config.autoplayDelay);
	}

	stopAutoplay() {
		clearInterval(this.autoplayTimer);
		clearTimeout(this.autoplayResumeTimer);
	}

	userAction(action) {
		this.userInteracted = true;
		this.stopAutoplay();
		action();

		this.autoplayResumeTimer = setTimeout(() => {
			this.userInteracted = false;
			this.startAutoplay();
		}, 10000);
	}

	bindEvents() {
		this.updateDimensions = this.updateDimensions.bind(this);
		this.onDown = this.onDown.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onUp = this.onUp.bind(this);
		this.stopAutoplay = this.stopAutoplay.bind(this);
		this.startAutoplay = this.startAutoplay.bind(this);

		window.addEventListener('load', this.updateDimensions);

		window.addEventListener('resize', () => {
			this.carousel.classList.add('is-resizing');

			clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => {
				this.updateDimensions();
				this.carousel.classList.remove('is-resizing');
			}, 250);
		});

		this.prevBtn?.addEventListener('click', () =>
			this.userAction(() => this.moveTo(this.virtualIndex - 1))
		);
		this.nextBtn?.addEventListener('click', () =>
			this.userAction(() => this.moveTo(this.virtualIndex + 1))
		);

		this.dots.forEach((dot, i) => {
			dot.addEventListener('click', () =>
				this.userAction(() => this.moveTo(i + this.config.clones))
			);
		});

		this.track.addEventListener('pointerdown', this.onDown);
		window.addEventListener('pointermove', this.onMove);
		window.addEventListener('pointerup', this.onUp);
		window.addEventListener('pointercancel', this.onUp);

		this.carousel.addEventListener('mouseenter', this.stopAutoplay);
		this.carousel.addEventListener('mouseleave', () => {
			if (!this.userInteracted) this.startAutoplay();
		});
		this.carousel.addEventListener('focusin', this.stopAutoplay);
		this.carousel.addEventListener('focusout', () => {
			if (!this.userInteracted) this.startAutoplay();
		});
	}

	onDown(e) {
		e.preventDefault();
		this.isDragging = true;
		this.startX = e.clientX;
		this.track.style.transition = 'none';
		this.dragDiff = 0;
		this.stopAutoplay();
	}

	onMove(e) {
		if (!this.isDragging) return;
		this.dragDiff = e.clientX - this.startX;

		this.track.style.transform = `translateX(${-this.virtualIndex * this.slideWidth + this.dragDiff}px)`;
	}

	onUp(e) {
		if (!this.isDragging) return;
		this.isDragging = false;

		if (Math.abs(this.dragDiff) > this.config.swipeThreshold) {
			this.userAction(() => {
				this.moveTo(
					this.dragDiff < 0
						? this.virtualIndex + 1
						: this.virtualIndex - 1
				);
			});
			return;
		} else if (Math.abs(this.dragDiff) < this.config.clickThreshold){
			const clickedElement = e.target;

			const clickedSlide = clickedElement.closest('.carousel-slide');

			if (clickedSlide) {
				const clickedIndex = this.allSlides.indexOf(clickedSlide);

				if (clickedIndex !== -1 && clickedIndex !== this.virtualIndex) {
					this.userAction(() => this.moveTo(clickedIndex));
					return;
				} 
			}
		} 

		this.moveTo(this.virtualIndex);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const carouselEl = document.querySelector('.carousel-outer-container');
	if (carouselEl) {
		new LiferayCarousel(carouselEl);
	}
});
