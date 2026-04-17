<template>
    <ul :class="['log', `theme-${theme}`]">
        <li
            v-if="withCommits && groupedCommits.remaining?.length"
            class="commits-wrapper"
        >
            <div class="commits">
                <div
                    v-for="(commit, index) in groupedCommits.remaining"
                    class="commit"
                >
                    <div class="meta">
                        <div v-if="index == 0" class="tag">LATEST</div>
                        <a class="sha commit-sha" :href="commit.html_url" target="_blank">
                            {{ commit.sha.slice(0, 7) }}
                        </a>
                        <p>{{ formatCommitDate(commit.commit?.author?.date ?? commit.commit?.committer?.date) }}</p>
                    </div>
                    <div class="commit-info" v-html="commitMessageToHTML(commit.commit.message)" />
                </div>
            </div>
        </li>
        <template
            v-for="(log, index) in entriesFiltered"
        >
            <li class="log-entry">
                <div class="version">
                    <div v-if="index == 0 && groupedCommits.remaining.length == 0" class="tag">
                        LATEST
                    </div>
                    <h3>v{{ log.version.number }}</h3>
                    <a
                        v-if="groupedCommits.versionCommits[log.version.number]"
                        class="commit-sha"

                        :href="groupedCommits.versionCommits[log.version.number]!.html_url"
                        target="_blank"
                    >
                        {{ groupedCommits.versionCommits[log.version.number]!.sha.slice(0, 7) }}
                    </a>
                    <p>{{ formatCommitDate(log.version.date +' '+ log.version.time, true) }}</p>
                </div>
                <div class="body">
                    <h2>{{ log.title }}</h2>
                    <p v-if="log.description" v-html="log.description" />
                    
                    <template v-if="hasMore(log)">
                        <FormButton
                            size="tiny"
                            @click="changelogExpanded[log.version.number] = !changelogExpanded[log.version.number]"
                        >
                            <span v-if="!changelogExpanded[log.version.number]">
                                SEE MORE

                                <Tex
                                    image="chevronDown"
                                    color="var(--text-color)"

                                    width="20px"
                                    height="16px"
                                />
                            </span>
                            <span v-else>
                                SEE LESS

                                <Tex
                                    image="chevronUp"
                                    color="var(--text-color)"

                                    width="20px"
                                    height="16px"
                                />
                            </span>
                        </FormButton>
                        <br/>
                    </template>

                    <div v-if="!changelogExpanded[log.version.number] && log.images?.length">
                        <ul class="images presentation">
                            <li @click="lightBoxedImage = log.images[0]">
                                <img :src="log.images[0]" />
                            </li>
                        </ul>
                    </div>
                    <div v-else-if="changelogExpanded[log.version.number]" class="more">
                        <template v-if="log.list?.length">
                            <h3>{{ log.listTitle ?? `Changes` }}</h3>
                            <ul class="changes">
                                <li
                                    v-for="change in log.list"
                                    v-html="change"
                                />
                            </ul>
                        </template>
                        <ul v-if="log.images" class="images">
                            <li
                                v-for="image in log.images"

                                @click="lightBoxedImage = image"
                            >
                                <img :src="image" />
                            </li>
                        </ul>

                        <div v-if="groupedCommits.versionCommits[log.version.number]" class="commit">
                            <br v-if="log.images" />
                            <h3>
                                Commit
                                <a :href="groupedCommits.versionCommits[log.version.number]!.html_url" target="_blank">
                                    <Tex
                                        image="link"
                                        color="var(--blue)"
                                        hover="color"
                                        hover-color="var(--color-accent)"

                                        clickable

                                        width="28px"
                                        height="20px"
                                        inline

                                        title="Open Commit on GitHub"
                                    />
                                </a>
                            </h3>
                            <div
                                class="commit-info"
                                v-html="commitMessageToHTML(
                                    groupedCommits.versionCommits[log.version.number]!.commit.message
                                )"
                            />
                        </div>

                        <br/>
                        <FormButton
                            v-if="hasMore(log, true)"
                            class="see-less-inner"

                            size="tiny"
                            @click="changelogExpanded[log.version.number] = !changelogExpanded[log.version.number]"
                        >
                            <span>
                                SEE LESS

                                <Tex
                                    image="chevronUp"
                                    color="var(--text-color)"

                                    width="20px"
                                    height="16px"
                                />
                            </span>
                        </FormButton>
                    </div>
                </div>
            </li>
            <li
                v-if="withCommits && groupedCommits.groups[log.version.number]"
                class="commits-wrapper"
            >
                <div class="commits">
                    <div
                        v-for="commit in groupedCommits.groups[log.version.number]"
                        class="commit"
                    >
                        <div class="meta">
                            <a class="sha commit-sha" :href="commit.html_url" target="_blank">
                                {{ commit.sha.slice(0, 7) }}
                            </a>
                            <p>{{ formatCommitDate(commit.commit?.author?.date ?? commit.commit?.committer?.date) }}</p>
                        </div>
                        <div class="commit-info" v-html="commitMessageToHTML(commit.commit.message)" />
                    </div>
                </div>
            </li>
        </template>

        <Teleport to="body">
            <div v-if="lightBoxedImage" class="lightbox-wrapper" @click="lightBoxedImage = undefined">
                <img :src="lightBoxedImage">
            </div>
        </Teleport>
    </ul>
</template>

<style src="@/assets/style/components/changelog.sass" scoped></style>

<script setup lang="ts">
import { CHANGELOG, groupCommitsByVersion, type ChangeLogEntry } from '~/assets/data/changelog';
import COMMITS_CACHE from '~/assets/data/commits-cache.json';

const props = withDefaults(defineProps<{
    theme?: 'light'|'dark',
    limit?: number,
    withCommits?: boolean
}>(), {
    theme: 'dark',
    withCommits: true
});

async function getCommits() {
    try {
        const res = await fetch(`https://api.github.com/repos/${config.githubUser}/${config.githubRepo}/commits?per_page=100`);
        if (!res.ok)
            throw new Error();

        return await res.json();
    }
    catch {
        return COMMITS_CACHE;
    }
}

const groupedCommits = groupCommitsByVersion((await getCommits()) as any);

function commitMessageToHTML(message: string) {
    message = message.replace(/((?:https?:\/\/|www\.)[^\s<>"{}|\\^`\[\]]+)/g, (_, url: string) => {
        let punctuation = '';
        const clean = url.replace(/([.,;:!)]+$)/g, (__, punc) => {
            punctuation += punc;
            return '';
        });
        return `<a href="${clean}" target="_blank">${clean}${punctuation}</a>`;
    });

    let [ title, ...rest ] = message.split('\n');
    if (!title)
        title = message;

    return `
        <h3>${title}</h3>
        <p>${rest.join('<br>')}</p>
    `
}

function formatCommitDate(dateString: string, appendUTC?: boolean) {
    const date = new Date(dateString + (appendUTC ? ' UTC' : ''));
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return `${MONTHS[month]![0]} ${day}, ${year}`;
}

const entriesFiltered = computed(() => {
    const entries = CHANGELOG().toReversed();
    if (props.limit)
        entries.splice(props.limit, entries.length - props.limit);

    return entries;
});

function hasMore(entry: ChangeLogEntry, isLong = false) {
    const hasMore = entry.list?.length || entry.images || !!groupedCommits.versionCommits[entry.version.number];
    if (!isLong)
        return hasMore;
    else
        return hasMore && (entry.images?.length ?? 0) >= 2;
}

const changelogExpanded = ref<Record<string, boolean>>({});

const lightBoxedImage = ref<string|undefined>();

</script>