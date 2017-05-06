
struct Ray {
	vec3 direction;
	vec3 origin;
};




vec3 trace(const Ray ray, bool isEyeRay) {
	vec3 final = vec3(0.f);
	
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	Ray r;
	r.origin = vec3(0.f,0.f,-3.f);
	r.direction = normalize(vec3(uv, 1.0));
	fragColor = vec4(trace(r,true),1.f);
}