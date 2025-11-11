/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

class Carousel {
	constructor(carouselElement) {
		if (!carouselElement) {
			return;
		}

		this.carousel = carouselElement;

		this.dots = Array.from(
			this.carousel.querySelectorAll('.carousel-pagination-item')
		);
		this.nextBtn = this.carousel.querySelector('.carousel-next');
		this.originalSlides = Array.from(
			this.carousel.querySelectorAll('.carousel-slide')
		);
		this.prevBtn = this.carousel.querySelector('.carousel-prev');
		this.track = this.carousel.querySelector('.carousel-track');

		this.config = {
			autoplayDelay: 6000,
			clickThreshold: 5,
			clones: 2,
			mobileConstraint: 768,
			swipeThreshold: 50,
			transitionSpeed: 450,
		};

		this.allSlides = [];
		this.autoplayResumeTimer = null;
		this.autoplayTimer = null;
		this.debounceTimer = null;
		this.dragDiff = 0;
		this.isDragging = false;
		this.isMobile = false;
		this.jumpTimeout = null;
		this.slideWidth = 0;
		this.startX = 0;
		this.total = this.originalSlides.length;
		this.userInteracted = false;
		this.virtualIndex = this.config.clones;

		this.init();
	}

	bindEvents() {
		this.onDown = this.onDown.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onUp = this.onUp.bind(this);
		this.startAutoplay = this.startAutoplay.bind(this);
		this.stopAutoplay = this.stopAutoplay.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);

		window.addEventListener('resize', () => {
			this.carousel.classList.add('is-resizing');

			clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => {
				this.updateDimensions();
				this.carousel.classList.remove('is-resizing');
			}, 250);
		});

		this.dots.forEach((dot, i) => {
			dot.addEventListener('click', () =>
				this.userAction(() => this.moveTo(i + this.config.clones))
			);
		});

		this.nextBtn?.addEventListener('click', () =>
			this.userAction(() => this.moveTo(this.virtualIndex + 1))
		);

		this.prevBtn?.addEventListener('click', () =>
			this.userAction(() => this.moveTo(this.virtualIndex - 1))
		);

		this.track.addEventListener('pointerdown', this.onDown);

		window.addEventListener('pointercancel', this.onUp);
		window.addEventListener('pointermove', this.onMove);
		window.addEventListener('pointerup', this.onUp);

		this.carousel.addEventListener('focusin', this.stopAutoplay);
		this.carousel.addEventListener('focusout', () => {
			if (!this.userInteracted) {
				this.startAutoplay();
			}
		});
		
		this.carousel.addEventListener('mouseenter', this.stopAutoplay);
		this.carousel.addEventListener('mouseleave', () => {
			if (!this.userInteracted) {
				this.startAutoplay();
			}
		});
	}

	createClones() {
		const fragAfter = document.createDocumentFragment();
		const fragBefore = document.createDocumentFragment();
		
		for (let i = 0; i < this.config.clones; i++) {
			const cloneEnd = this.originalSlides[i].cloneNode(true);
			const cloneStart =
				this.originalSlides[this.total - 1 - i].cloneNode(true);

			fragAfter.appendChild(cloneEnd);
			fragBefore.prepend(cloneStart);
		}

		this.track.append(fragAfter);
		this.track.prepend(fragBefore);
	}

	getRealIndex() {
		return (
			(this.virtualIndex - this.config.clones + this.total) % this.total
		);
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

	init() {
		if (this.total <= 1) {
			this.allSlides = this.originalSlides;

			this.allSlides[0].classList.add('is-active');
			this.allSlides[0].style.cursor = 'default';
		}
		else {
			this.createClones();
			this.allSlides = Array.from(
				this.track.querySelectorAll('.carousel-slide')
			);
			this.bindEvents();
			this.updateDimensions();
			this.startAutoplay();
		}
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

	onDown(event) {
		event.preventDefault();
		this.isDragging = true;
		this.startX = event.clientX;
		this.track.style.transition = 'none';
		this.dragDiff = 0;
		this.stopAutoplay();
	}

	onMove(event) {
		if (!this.isDragging) {
			return;
		}

		this.dragDiff = event.clientX - this.startX;
		this.track.style.transform = `translateX(${-this.virtualIndex * this.slideWidth + this.dragDiff}px)`;
	}

	onUp(event) {
		if (!this.isDragging) {
			return;
		}

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
		}
		else if (Math.abs(this.dragDiff) < this.config.clickThreshold) {
			const clickedElement = event.target;

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

	startAutoplay() {
		if (this.autoplayTimer) {
			clearInterval(this.autoplayTimer);
		}

		this.autoplayTimer = setInterval(() => {
			this.moveTo(this.virtualIndex + 1);
		}, this.config.autoplayDelay);
	}

	stopAutoplay() {
		clearInterval(this.autoplayTimer);
		clearTimeout(this.autoplayResumeTimer);
	}

	updateDimensions() {
		const gap = Number.parseFloat(
			getComputedStyle(this.track).columnGap || 0
		);

		this.slideWidth = this.allSlides[0].getBoundingClientRect().width + gap;
		this.moveTo(this.virtualIndex, false);
	}

	updateDots() {
		const realIndex = this.getRealIndex();

		this.dots.forEach((dot, i) => {
			dot.classList.toggle('is-active', i === realIndex);
		});
	}

	updateStates() {
		const realIndex = this.getRealIndex();

		this.allSlides.forEach((slide, i) => {
			const slideIndex =
				(i - this.config.clones + this.total) % this.total;
			slide.classList.remove('is-active', 'is-peek');

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

	userAction(action) {
		this.userInteracted = true;
		this.stopAutoplay();
		action();

		this.autoplayResumeTimer = setTimeout(() => {
			this.userInteracted = false;
			this.startAutoplay();
		}, 10000);
	}
}

Liferay.on('allPortletsReady', () => {
	const carousels = document.querySelectorAll('.carousel-outer-container');

	carousels.forEach((carouselEl) => new Carousel(carouselEl));
});
