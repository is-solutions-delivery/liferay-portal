/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Image from 'next/image';
import {PropsWithChildren} from 'react';

import {Button} from '../../components/button';
import {LocalizedField} from '../../liferay/index';
import {liferay} from '../../liferay/server';
import {getContentData} from './data';

const getLocalizedFieldValue = ({
	lang,
	value,
	value_i18n,
}: {lang: string} & LocalizedField<'value'>) => {
	return value_i18n[lang] ?? value;
};

const PageTemplate = ({children}: PropsWithChildren) => {
	return (
		<div className="w-full">
			{children}
		</div>
	);
};

export default async function Home({
	params,
}: Readonly<{
	params: Promise<{lang: string}>;
}>) {
	const {lang} = await params;
	const {data, error} = await getContentData({
		lang,
		liferay,
	});

	if (error || !data) {
		return (
			<PageTemplate>
				<div className="container mx-auto px-4 py-12">
					<details className="border p-4 rounded-md">
						<summary>Error: not able to load content</summary>

						<pre className="font-mono">
							{error instanceof Error
								? error.stack
								: JSON.stringify(error, null, 2)}
						</pre>
					</details>
				</div>
			</PageTemplate>
		);
	}

	return (
		<PageTemplate>
			{/* Dynamic Hero - Breaking News / Event of the Month */}
			<section className="hero-section-evolve">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
						<div className="order-2 md:order-1">
							<Image
								alt={data.image.link.label}
								className="rounded-2xl shadow-2xl w-full hover:scale-105 transition-transform duration-500"
								height={500}
								priority={true}
								src={liferay.getDocument(data.image.link.href)}
								unoptimized={true}
								width={500}
							/>
						</div>

						<div className="order-1 md:order-2 space-y-6">
							<div className="inline-block">
								<span className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
									🔴 Breaking News
								</span>
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								{getLocalizedFieldValue({
									lang,
									value: data.title,
									value_i18n: data.title_i18n,
								})}
							</h1>
							<p className="text-lg text-gray-700 leading-relaxed">
								{getLocalizedFieldValue({
									lang,
									value: data.summary,
									value_i18n: data.summary_i18n,
								})}
							</p>
							<div className="flex gap-4">
								<Button external={true} href={data.registrationLink}>
									<span className="uppercase font-bold">Learn More</span>
								</Button>
								<button className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-md font-bold hover:bg-gray-900 hover:text-white transition-all">
									SHARE
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Latest News Ticker */}
			<section className="news-ticker">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-4 py-4 overflow-hidden">
						<span className="bg-red-600 text-white px-4 py-2 font-bold text-sm whitespace-nowrap rounded">
							LATEST NEWS
						</span>
						<div className="ticker-content">
							<span className="ticker-item">
								🔥 New Product Launch: Liferay DXP 2025 Available Now
							</span>
							<span className="ticker-item">
								📅 Join us for the Community Summit - March 15th
							</span>
							<span className="ticker-item">
								🎉 Liferay Named Leader in Gartner Magic Quadrant
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Upcoming Events Engine */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
							<p className="text-gray-600">Join our workshops, webinars, and community meetups</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors">
								All
							</button>
							<button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
								Virtual
							</button>
							<button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
								In-Person
							</button>
						</div>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8">
						{/* Event 1 */}
						<div className="event-card group">
							<div className="event-date-badge">
								<div className="text-3xl font-bold">15</div>
								<div className="text-xs uppercase">Mar</div>
							</div>
							<div className="event-image-container">
								<Image
									alt="Community Workshop"
									className="w-full h-48 object-cover"
									height={192}
									src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="event-type-badge">Virtual</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
									Digital Experience Platform Workshop
								</h3>
								<p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
									<span>🌐</span> Online via Zoom
								</p>
								<p className="text-sm text-gray-500 mb-4">
									Learn how to build modern digital experiences with Liferay DXP
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-500">150 / 200 seats</span>
									<Button external={false} href={data.registrationLink}>
										<span className="text-sm font-bold">Register Now</span>
									</Button>
								</div>
							</div>
						</div>

						{/* Event 2 */}
						<div className="event-card group">
							<div className="event-date-badge">
								<div className="text-3xl font-bold">22</div>
								<div className="text-xs uppercase">Mar</div>
							</div>
							<div className="event-image-container">
								<Image
									alt="Headless CMS Webinar"
									className="w-full h-48 object-cover"
									height={192}
									src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="event-type-badge">Virtual</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
									Headless CMS Architecture Patterns
								</h3>
								<p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
									<span>🌐</span> Online via Zoom
								</p>
								<p className="text-sm text-gray-500 mb-4">
									Explore modern content delivery strategies with GraphQL and REST APIs
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-500">85 / 150 seats</span>
									<Button external={false} href={data.registrationLink}>
										<span className="text-sm font-bold">Register Now</span>
									</Button>
								</div>
							</div>
						</div>

						{/* Event 3 */}
						<div className="event-card group">
							<div className="event-date-badge">
								<div className="text-3xl font-bold">05</div>
								<div className="text-xs uppercase">Apr</div>
							</div>
							<div className="event-image-container">
								<Image
									alt="Developer Meetup"
									className="w-full h-48 object-cover"
									height={192}
									src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="event-type-badge event-type-inperson">In-Person</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
									Developer Community Meetup
								</h3>
								<p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
									<span>📍</span> {data.locationName}
								</p>
								<p className="text-sm text-gray-500 mb-4">
									Network with fellow developers and share best practices
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-500">42 / 100 seats</span>
									<Button external={false} href={data.registrationLink}>
										<span className="text-sm font-bold">Register Now</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Global News Feed with Taxonomy */}
			<section className="py-20 bg-gradient-to-b from-gray-50 to-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold mb-2">Global News</h2>
							<p className="text-gray-600">Latest updates, announcements, and press releases</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors">
								All News
							</button>
							<button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
								Press Release
							</button>
							<button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
								Community
							</button>
							<button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
								Product Updates
							</button>
						</div>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						{/* News Article 1 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Product Launch"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-product">Product Updates</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 25, 2026</span>
									<span>•</span>
									<span>5 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									Liferay DXP 2025: Next Generation Digital Experience
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									Introducing groundbreaking features including AI-powered content recommendations, enhanced headless capabilities, and improved developer experience.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* News Article 2 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Press Release"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-press">Press Release</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 23, 2026</span>
									<span>•</span>
									<span>3 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									Liferay Named Leader in Gartner Magic Quadrant
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									Recognition for completeness of vision and ability to execute in the Digital Experience Platform market for the fifth consecutive year.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* News Article 3 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Community News"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-community">Community</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 20, 2026</span>
									<span>•</span>
									<span>4 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									Community Summit 2026: Call for Speakers
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									We're looking for passionate community members to share their experiences, insights, and best practices at our annual summit.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* News Article 4 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Technical Update"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-product">Product Updates</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 18, 2026</span>
									<span>•</span>
									<span>6 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									GraphQL API Enhancements: What's New
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									Explore the latest improvements to our GraphQL API, including new queries, mutations, and performance optimizations.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* News Article 5 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Partnership"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-press">Press Release</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 15, 2026</span>
									<span>•</span>
									<span>4 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									Strategic Partnership with Vercel Announced
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									Liferay and Vercel join forces to deliver unprecedented performance and developer experience for modern web applications.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* News Article 6 */}
						<article className="news-card group">
							<div className="news-image-container">
								<Image
									alt="Community Highlight"
									className="w-full h-56 object-cover"
									height={224}
									src="https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop"
									unoptimized={true}
									width={400}
								/>
								<span className="news-category-badge badge-community">Community</span>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
									<span>📅 Jan 12, 2026</span>
									<span>•</span>
									<span>5 min read</span>
								</div>
								<h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
									Developer Spotlight: Building with Liferay Headless
								</h3>
								<p className="text-sm text-gray-600 mb-4">
									Meet developers who are pushing the boundaries of what's possible with Liferay's headless architecture.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group/link">
									READ FULL ARTICLE 
									<span className="group-hover/link:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>
					</div>
				</div>
			</section>

			{/* CTA - Powered by Liferay */}
			<section className="cta-section">
				<div className="container mx-auto px-4 max-w-6xl py-20">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
							Powered by Liferay Headless CMS
						</h2>
						<p className="text-lg mb-8 opacity-90">
							"Evolve" showcases the power of Liferay as a centralized content hub, deployed seamlessly on Vercel for optimal performance.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Button external={false} href="https://liferay.dev">
								<span className="uppercase font-bold">Explore Liferay</span>
							</Button>
							<button className="px-8 py-3 border-2 border-white text-white rounded-md font-bold hover:bg-white hover:text-gray-900 transition-all">
								VIEW DOCUMENTATION
							</button>
						</div>
						<div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm opacity-75">
							<span>🚀 Next.js 15</span>
							<span>📦 Liferay Headless API</span>
							<span>⚡ Vercel Edge Network</span>
							<span>🎨 Tailwind CSS</span>
						</div>
					</div>
				</div>
			</section>

			{/* Event Location Detail (from original data) */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="grid md:grid-cols-2 gap-12">
						<div>
							<iframe
								allowFullScreen={false}
								className="w-full rounded-lg shadow-md"
								draggable="false"
								height="400"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								src={data.locationMapUrl}
								title="Location Map"
								width="100%"
							/>
						</div>

						<div className="flex flex-col justify-center">
							<h3 className="text-2xl font-bold mb-6">Event Location Details</h3>

							<div className="space-y-4">
								<div>
									<strong className="block text-sm uppercase tracking-wide text-gray-500 mb-1">📍 Location</strong>
									<span className="text-lg">{data.locationName}</span>
								</div>

								<div>
									<strong className="block text-sm uppercase tracking-wide text-gray-500 mb-1">📅 Date and Time</strong>
									<span className="text-lg">
										{new Date(data.dateCreated).toLocaleString(lang)}
									</span>
								</div>

								<div className="pt-4 flex gap-3 flex-wrap">
									<Button external={true} href={data.registrationLink}>
										<span className="uppercase font-bold">Register Now</span>
									</Button>
									<button className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-md font-bold hover:bg-gray-900 hover:text-white transition-all">
										📅 SAVE TO CALENDAR
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageTemplate>
	);
}