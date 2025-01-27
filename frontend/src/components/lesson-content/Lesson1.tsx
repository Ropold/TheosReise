export default function Lesson1() {
    return (
        <div className="lesson-content-card-container">
            <h3>Kapitel 1 Oma Elfi - Lesson1.tsx:</h3>
                        {/* Audio Player */}
            <audio controls>
                <source
                    src="https://res.cloudinary.com/dzjjlydk3/video/upload/v1737969925/Kapitel_1_id96p7.m4a"
                    type="audio/mpeg"
                />
                Dein Browser unterstützt das Audioelement nicht.
            </audio>
        </div>
    );
}