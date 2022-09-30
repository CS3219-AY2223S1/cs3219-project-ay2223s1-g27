export default function QuestionDisplay({content}) {
    return <div className="px-4 py-2">
        <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
}
