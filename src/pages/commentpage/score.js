import nlp from 'compromise'

export default function Score(comment) {
	var obj = nlp(comment)
	var nospace = comment.replace(/ /g,'')
	var lengthscore = nospace.length * 0.2
	if (lengthscore > 25) {
		lengthscore = 25
	}
	var topics = obj.topics().out("array")
	var nouns = obj.nouns().out("array")
	var verbs = obj.verbs().out("array")
	var adjectives = obj.adjectives().out("array")
	var adverbs = obj.adverbs().out("array")
	var sentences = obj.sentences().out("array")
	var clauses = obj.clauses().out("array")
	var hashTags = obj.hashTags().out("array")
	var score = lengthscore + topics.length * 10 + nouns.length * 10 + verbs.length * 10 + adjectives.length * 10 + clauses.length * 10 + adverbs.length * 10 + hashTags.length * 10 + sentences.length * 10
	if (score > 100) {
		score = 100
	}
	return score
}