<script lang="ts">
	import { listings } from '#lib/data/listings.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import {
		Building2,
		ChartNoAxesColumnIncreasing,
		Check,
		Clock3,
		Heart,
		Home,
		MessageCircle,
		Plus,
		TrendingUp,
		Users
	} from '@lucide/svelte';

	let activeTab = $state<'listings' | 'inquiries'>('listings');
	const providerListings = listings.slice(0, 5);
</script>

<main class="mx-auto max-w-360 px-4 py-7 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-xs font-black tracking-[0.16em] text-[#176b4d] uppercase">
				Provider dashboard
			</p>
			<h1 class="mt-2 text-3xl font-black tracking-tight">Good morning, Maria</h1>
			<p class="mt-2 text-sm text-[#718078]">Here's how your properties are doing.</p>
		</div>
		<Button class="h-10 rounded-lg bg-[#176b4d] px-4 font-bold">
			<Plus class="mr-2 size-4" /> Add listing
		</Button>
	</div>

	<div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<div class="rounded-2xl border border-[#dde3dc] bg-white p-5">
			<div class="flex items-center justify-between">
				<span class="text-sm text-[#718078]">Active listings</span><Building2
					class="size-4 text-[#176b4d]"
				/>
			</div>
			<p class="mt-3 text-3xl font-black">12</p>
			<p class="mt-2 text-xs font-bold text-[#176b4d]">+2 this month</p>
		</div>
		<div class="rounded-2xl border border-[#dde3dc] bg-white p-5">
			<div class="flex items-center justify-between">
				<span class="text-sm text-[#718078]">New inquiries</span><MessageCircle
					class="size-4 text-[#ef7d57]"
				/>
			</div>
			<p class="mt-3 text-3xl font-black">28</p>
			<p class="mt-2 text-xs font-bold text-[#ef7d57]">6 need a reply</p>
		</div>
		<div class="rounded-2xl border border-[#dde3dc] bg-white p-5">
			<div class="flex items-center justify-between">
				<span class="text-sm text-[#718078]">Profile views</span><ChartNoAxesColumnIncreasing
					class="size-4 text-[#176b4d]"
				/>
			</div>
			<p class="mt-3 text-3xl font-black">1,284</p>
			<p class="mt-2 flex items-center gap-1 text-xs font-bold text-[#176b4d]">
				<TrendingUp class="size-3" /> 18% this week
			</p>
		</div>
		<div class="rounded-2xl border border-[#dde3dc] bg-white p-5">
			<div class="flex items-center justify-between">
				<span class="text-sm text-[#718078]">Saved rooms</span><Heart
					class="size-4 text-[#ef7d57]"
				/>
			</div>
			<p class="mt-3 text-3xl font-black">96</p>
			<p class="mt-2 text-xs text-[#718078]">Across active listings</p>
		</div>
	</div>

	<div class="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
		<section class="overflow-hidden rounded-2xl border border-[#dde3dc] bg-white">
			<div class="flex border-b border-[#edf0ec] px-5">
				<button
					class={`border-b-2 px-3 py-4 text-sm font-bold ${activeTab === 'listings' ? 'border-[#176b4d] text-[#176b4d]' : 'border-transparent text-[#718078]'}`}
					onclick={() => (activeTab = 'listings')}
				>
					Your listings
				</button>
				<button
					class={`border-b-2 px-3 py-4 text-sm font-bold ${activeTab === 'inquiries' ? 'border-[#176b4d] text-[#176b4d]' : 'border-transparent text-[#718078]'}`}
					onclick={() => (activeTab = 'inquiries')}
				>
					Inquiries <span
						class="ml-1 rounded-full bg-[#ef7d57] px-1.5 py-0.5 text-[10px] text-white"
					>
						6
					</span>
				</button>
			</div>

			{#if activeTab === 'listings'}
				<div class="divide-y divide-[#edf0ec]">
					{#each providerListings as listing}
						<div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
							<img
								src={listing.image}
								alt={listing.name}
								class="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-28"
							/>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h3 class="truncate font-black">{listing.name}</h3>
									<Badge variant="secondary" class="text-[#176b4d]">{listing.available}</Badge>
								</div>
								<p class="mt-1 text-xs text-[#718078]">{listing.location}</p>
								<p class="mt-2 text-sm font-black">
									₱{listing.rent.toLocaleString()}
									<span class="text-xs font-normal text-[#718078]">/ month</span>
								</p>
							</div>
							<div class="flex items-center gap-5 text-xs text-[#718078]">
								<div class="text-center">
									<Heart class="mx-auto size-4" />
									<p class="mt-1 font-bold text-[#18231d]">{18 + listing.id}</p>
								</div>
								<div class="text-center">
									<Users class="mx-auto size-4" />
									<p class="mt-1 font-bold text-[#18231d]">{2 + (listing.id % 5)}</p>
								</div>
								<Button variant="outline" size="sm" class="rounded-lg">Manage</Button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="divide-y divide-[#edf0ec]">
					{#each listings.slice(12, 18) as listing, i}
						<button class="flex w-full items-center gap-3 p-4 text-left hover:bg-[#f7f8f6]">
							<div
								class="flex size-10 items-center justify-center rounded-full bg-[#dce9df] text-xs font-black text-[#176b4d]"
							>
								{listing.sellerInitials}
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm font-black">
									{['Jasmine Reyes', 'Miguel Torres', 'Paolo Cruz'][i % 3]}
								</p>
								<p class="mt-1 truncate text-xs text-[#718078]">Interested in {listing.name}</p>
							</div>
							<span class="text-xs text-[#718078]">{i + 1}h ago</span>
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<aside class="rounded-2xl border border-[#dde3dc] bg-white p-5">
			<div class="flex items-center justify-between">
				<h2 class="font-black">Recent activity</h2>
				<Clock3 class="size-4 text-[#718078]" />
			</div>
			<div class="mt-5 space-y-5">
				<div class="flex gap-3">
					<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf3ef]">
						<Heart class="size-4 text-[#176b4d]" />
					</div>
					<div>
						<p class="text-sm font-bold">New listing saved</p>
						<p class="mt-1 text-xs leading-5 text-[#718078]">
							A student saved your studio near Katipunan.
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fff1eb]">
						<MessageCircle class="size-4 text-[#ef7d57]" />
					</div>
					<div>
						<p class="text-sm font-bold">New inquiry received</p>
						<p class="mt-1 text-xs leading-5 text-[#718078]">
							Jasmine asked about utilities and move-in.
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf3ef]">
						<Check class="size-4 text-[#176b4d]" />
					</div>
					<div>
						<p class="text-sm font-bold">Listing verified</p>
						<p class="mt-1 text-xs leading-5 text-[#718078]">UP Campus unit passed verification.</p>
					</div>
				</div>
			</div>
			<Button href="/" variant="outline" class="mt-6 h-9 w-full rounded-lg font-bold">
				Open inbox
			</Button>
		</aside>
	</div>
</main>
