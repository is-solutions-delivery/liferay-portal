/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Image from 'next/image';
import {PropsWithChildren} from 'react';

import {Button} from '../../../components/button';
import {LocalizedField} from '../../../liferay/index';
import {liferay} from '../../../liferay/server';
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
			{/* Hero Section */}
			<section className="hero-section">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
						<div className="order-2 md:order-1">
							<Image
								alt={data.image.link.label}
								className="rounded-lg shadow-lg w-full"
								height={500}
								priority={true}
								src={liferay.getDocument(data.image.link.href)}
								unoptimized={true}
								width={500}
							/>
						</div>

						<div className="order-1 md:order-2 hero-content">
							<p className="text-sm uppercase tracking-wide mb-4 opacity-80">Welcome to Masterclass</p>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
								{getLocalizedFieldValue({
									lang,
									value: data.title,
									value_i18n: data.title_i18n,
								}) || 'The new way of learning.'}
							</h1>
							<p className="text-lg mb-8 opacity-90">
								{getLocalizedFieldValue({
									lang,
									value: data.summary,
									value_i18n: data.summary_i18n,
								}) || 'Take charge of your future with the best online learning platform.'}
							</p>
							<div className="content-box">
								<div
									className="text-xs leading-relaxed"
									dangerouslySetInnerHTML={{
										__html: getLocalizedFieldValue({
											lang,
											value: data.content,
											value_i18n: data.content_i18n,
										}),
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Courses Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<h2 className="text-3xl font-bold text-center mb-12">Courses</h2>
					
					<div className="grid md:grid-cols-3 gap-8">
						{/* Course 1 */}
						<div className="course-card group">
							<div className="mb-4">
								<span className="text-xs uppercase tracking-wide text-gray-500">Marketing</span>
								<h3 className="text-xl font-bold mt-2 mb-3">Digital Marketing Bootcamp</h3>
								<p className="text-sm text-gray-600 mb-4">
									This is a short description to introduce the key aspects of the course.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
									READ MORE →
								</a>
							</div>
						</div>

						{/* Course 2 */}
						<div className="course-card group">
							<div className="mb-4">
								<span className="text-xs uppercase tracking-wide text-gray-500">Design</span>
								<h3 className="text-xl font-bold mt-2 mb-3">Product Design Bootcamp</h3>
								<p className="text-sm text-gray-600 mb-4">
									This is a short description to introduce the key aspects of the course.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
									READ MORE →
								</a>
							</div>
						</div>

						{/* Course 3 */}
						<div className="course-card group">
							<div className="mb-4">
								<span className="text-xs uppercase tracking-wide text-gray-500">Management</span>
								<h3 className="text-xl font-bold mt-2 mb-3">Project Manager Certification</h3>
								<p className="text-sm text-gray-600 mb-4">
									This is a short description to introduce the key aspects of the course.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
									READ MORE →
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Statistics Section */}
			<section className="stats-section">
				<div className="grid md:grid-cols-3">
					{/* Stat 1 */}
					<div className="stat-card stat-dark">
						<p className="text-xs uppercase tracking-wide mb-2 opacity-70">Student instructors</p>
						<div className="text-5xl md:text-6xl font-bold mb-4">+70</div>
						<p className="text-sm opacity-80">Award winners world-class innovators<br />and industry elites.</p>
					</div>

					{/* Stat 2 */}
					<div className="stat-card stat-light">
						<p className="text-xs uppercase tracking-wide mb-2 opacity-70">Expert editors</p>
						<div className="text-5xl md:text-6xl font-bold mb-4">24m.</div>
						<p className="text-sm opacity-80">Award winners world-class innovators<br />and industry elites.</p>
					</div>

					{/* Stat 3 */}
					<div className="stat-card stat-pale">
						<p className="text-xs uppercase tracking-wide mb-2 opacity-70">Employment Rate</p>
						<div className="text-5xl md:text-6xl font-bold mb-4">91%</div>
						<p className="text-sm opacity-80">Award winners world-class innovators<br />and industry elites.</p>
					</div>
				</div>
			</section>

			{/* Companies Section */}
			<section className="py-16 companies-section">
				<div className="container mx-auto px-4 max-w-6xl text-center">
					<h2 className="text-2xl font-bold mb-8">600+ hiring companies including</h2>
					
					<div className="flex flex-wrap items-center justify-center gap-12 mb-8">
						<div className="text-2xl font-bold">⛰️ MOUNTBLIX</div>
						<div className="text-2xl font-bold">Hartvora.</div>
						<div className="text-2xl font-bold">📚 Bootcamp</div>
						<div className="text-2xl font-bold italic">Rivënzo</div>
					</div>

					<p className="text-sm text-gray-600 mb-6">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor<br />
						incididunt ut labore et dolore magna aliqua.
					</p>

					<Button external={false} href={data.registrationLink}>
						<span className="uppercase font-bold">Apply Now</span>
					</Button>
				</div>
			</section>

			{/* Methodology Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<h2 className="text-3xl font-bold text-center mb-16">Methodology</h2>
					
					<div className="space-y-24">
						{/* Method 1 */}
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="relative">
								<div className="absolute -left-8 -top-8 w-48 h-48 bg-amber-200 rounded-lg -z-10"></div>
								<img 
									src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
									alt="Individual mentorship"
									className="rounded-lg shadow-lg w-full relative z-10"
								/>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-2">01.</p>
								<h3 className="text-3xl font-bold mb-4">Individual mentorship and full guidance.</h3>
								<p className="text-gray-600 mb-6">
									Amet minim mollit non deserunt ullamco sit aliqua dolor do amet sint Velit officia.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</div>

						{/* Method 2 */}
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="order-2 md:order-1">
								<p className="text-sm text-gray-500 mb-2">02.</p>
								<h3 className="text-3xl font-bold mb-4">Study schedules that fit with your life.</h3>
								<p className="text-gray-600 mb-6">
									Amet minim mollit non deserunt ullamco sit aliqua dolor do amet sint Velit officia.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
							<div className="relative order-1 md:order-2">
								<div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-200 rounded-lg -z-10"></div>
								<img 
									src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop"
									alt="Flexible study schedules"
									className="rounded-lg shadow-lg w-full relative z-10"
								/>
							</div>
						</div>

						{/* Method 3 */}
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="relative">
								<div className="absolute -left-8 -top-8 w-48 h-48 bg-amber-200 rounded-lg -z-10"></div>
								<img 
									src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&sat=-100"
									alt="In-person workshops"
									className="rounded-lg shadow-lg w-full relative z-10"
								/>
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-2">03.</p>
								<h3 className="text-3xl font-bold mb-4">In-person workshops, meetups and events.</h3>
								<p className="text-gray-600 mb-6">
									Amet minim mollit non deserunt ullamco sit aliqua dolor do amet sint Velit officia.
								</p>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Latest News Section */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4 max-w-6xl">
					<div className="flex justify-between items-center mb-12">
						<h2 className="text-3xl font-bold">Latest News</h2>
						<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
							VIEW ALL 
							<span className="group-hover:translate-x-1 transition-transform">→</span>
						</a>
					</div>
					
					<div className="grid md:grid-cols-3 gap-8 mb-12">
						{/* Blog Post 1 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=250&fit=crop"
								alt="Marketing team"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Marketing</p>
								<h3 className="text-lg font-bold mb-3">20 gifts you can give to your marketing boss</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* Blog Post 2 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop"
								alt="Management"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Management</p>
								<h3 className="text-lg font-bold mb-3">25 management tips from top industry experts</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* Blog Post 3 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop"
								alt="Design tools"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Design</p>
								<h3 className="text-lg font-bold mb-3">5 tools everyone in the design industry should be using</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Blog Post 4 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop"
								alt="Design work"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Design</p>
								<h3 className="text-lg font-bold mb-3">Great people doing a great job in the design industry</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* Blog Post 5 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop"
								alt="Marketing discussion"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Marketing</p>
								<h3 className="text-lg font-bold mb-3">Meet the Steve Jobs of the marketing industry</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>

						{/* Blog Post 6 */}
						<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
							<img 
								src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop"
								alt="Marketing advice"
								className="w-full h-48 object-cover"
							/>
							<div className="p-6">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Marketing</p>
								<h3 className="text-lg font-bold mb-3">The worst advice we've ever heard about marketing</h3>
								<a href="#" className="text-sm font-semibold inline-flex items-center gap-2 group">
									READ MORE 
									<span className="group-hover:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>
					</div>
				</div>
			</section>

			{/* Newsletter CTA Section */}
			<section className="newsletter-section">
				<div className="container mx-auto px-4 max-w-6xl py-20">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<img 
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
								alt="Join us"
								className="rounded-lg shadow-xl"
							/>
						</div>
						<div>
							<p className="text-sm mb-4 opacity-90">Get in touch with us!</p>
							<h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
								Join us now and start learning for free.
							</h2>
							<form className="flex gap-3 mb-4">
								<input 
									type="email" 
									placeholder="name@example.com"
									className="flex-1 px-6 py-3 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-gray-900"
								/>
								<button 
									type="submit"
									className="bg-gray-900 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors"
								>
									SUBSCRIBE
								</button>
							</form>
							<p className="text-xs opacity-75">
								(*) Amet minim mollit non deserunt ullamco sit aliqua dolor do amet.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Event Details Section */}
			<section className="py-16 bg-white">
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
							<h3 className="text-2xl font-bold mb-6">Plan your visit</h3>

							<div className="space-y-4">
								<div>
									<strong className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Location</strong>
									<span className="text-lg">{data.locationName}</span>
								</div>

								<div>
									<strong className="block text-sm uppercase tracking-wide text-gray-500 mb-1">Date and Time</strong>
									<span className="text-lg">
										{new Date(data.dateCreated).toLocaleString(lang)}
									</span>
								</div>

								<div className="pt-4">
									<Button external={true} href={data.registrationLink}>
										<span className="uppercase font-bold">Register Here</span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageTemplate>
	);
}