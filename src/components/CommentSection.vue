<!-- v1.0 -->
<template>
  <div class="comment-section mt-8">
    <h2 class="text-2xl font-bold mb-4">Comments</h2>
    <div v-if="comments.length > 0" class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center mb-2">
          <img :src="comment.author.avatar" :alt="comment.author.name" class="w-8 h-8 rounded-full mr-2">
          <span class="font-semibold">{{ comment.author.name }}</span>
          <span class="text-gray-500 text-sm ml-2">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
      </div>
    </div>
    <p v-else class="text-gray-500">No comments yet.</p>
    <form @submit.prevent="submitComment" class="mt-6">
      <textarea
        v-model="newComment"
        placeholder="Add a comment..."
        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        rows="3"
      ></textarea>
      <button
        type="submit"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="!newComment.trim()"
      >
        Post Comment
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CommentSection',
  props: {
    documentId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const comments = ref([])
    const newComment = ref('')

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?documentId=${props.documentId}`)
        const data = await response.json()
        comments.value = data.comments
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    const submitComment = async () => {
      if (!newComment.value.trim()) return

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            documentId: props.documentId,
            content: newComment.value
          })
        })

        if (response.ok) {
          await fetchComments()
          newComment.value = ''
        } else {
          console.error('Error submitting comment')
        }
      } catch (error) {
        console.error('Error submitting comment:', error)
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    fetchComments()

    return {
      comments,
      newComment,
      submitComment,
      formatDate
    }
  }
}
</script>

