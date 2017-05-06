#include "pathtracer.h"
#include <iostream>

#define BUMP 1e-4

static Random &rng = Random::common();

static float density = 1.f / (4 * pi());

PathTracer::PathTracer() {}

Radiance3 PathTracer::sample(int x, int y, Rect2D viewport)
{
    Radiance3 s = Radiance3::zero();
    double dx = rng.uniform(), dy = rng.uniform();
    Ray ray = m_world->camera()->worldRay(x + dx, y + dy, viewport);
    s=trace(ray,true);
    return s;
}


Radiance3 PathTracer::trace( const Ray &ray,
                      bool isEyeRay,
                      float *distance )
{

    Radiance3 final = Radiance3::black();

    // World::emissivePoint() expects there to be lights in the scene. Quit in that case.
    if (!m_world->lightsExist()) return final;

    std::shared_ptr<Surfel> surfl = nullptr;
    float f;
    bool hit = m_world->intersect(ray,f,surfl);

    if(!hit) return final;

    if(isEyeRay || m_settings.useEmitted) {
        final += surfl->emittedRadiance(-ray.direction());
    }

    final += estimateLs(ray, distance);

    return final;
}


Radiance3 PathTracer::estimateLs(const Ray &ray, float *distance) {
    Radiance3 final = Radiance3::black();

    std::shared_ptr<Surfel> surfl = nullptr;
    float f;
    bool hit = m_world->intersect(ray,f,surfl);

    if(!hit) return final;

    if(m_settings.useDirectDiffuse) {
        final += estimateLds(ray,surfl);
    }

    if(m_settings.useIndirect) {
        final += estimateLis(ray, surfl, distance);
    }

    return final;
}

Radiance3 PathTracer::estimateLis(const Ray &ray, const std::shared_ptr<Surfel> surfl, float *distance) {

    Vector3 w_o = -ray.direction();

    float u = rng.uniform();
    Color3 weight;
    Vector3 w_i;
    surfl->scatter(PathDirection::EYE_TO_SOURCE, w_o, false, rng, weight, w_i);
    float r = weight.average();

    if(u < r) {


        Radiance3 integrand = (estimateLs(Ray::fromOriginAndDirection(surfl->position, w_i).bumpedRay(0.0001f * sign(surfl->geometricNormal.dot(w_i)), surfl->geometricNormal), distance) * weight)/r;
        if(integrand.squaredLength() > 1.f) {
            return integrand.direction();
        }
        return integrand;
    }
    return Radiance3(0,0,0);
}

Radiance3 PathTracer::estimateLds(const Ray &ray, const std::shared_ptr<Surfel> surfl) {
    Radiance3 L_o = Radiance3(0,0,0);
    Vector3 q, normal;
    Tri tri;
    float prob, area;
    m_world->emissivePoint(rng,q,tri,normal,prob,area);

    shared_ptr<UniversalMaterial> material = dynamic_pointer_cast<UniversalMaterial>(tri.material());

    if(m_world->lineOfSight(surfl->position + surfl->geometricNormal * .0001f, q + normal * 0.0001f)) {

        Color3 weight;
        Vector3 w_i = (q - surfl->position);
        float dist2 = w_i.squaredLength();
        w_i /= sqrt(dist2);
        weight = surfl->finiteScatteringDensity(w_i, -ray.direction()) * surfl->geometricNormal.dot(w_i);

        float shadeDot = G3D::max(0.f,w_i.dot(surfl->shadingNormal));
        float geoDot = G3D::max(0.f, -w_i.dot(normal.direction())/dist2);
        L_o += prob * weight * shadeDot * geoDot * (material->emissive().mean()/G3D::pi());
    }


    G3D::Surfel::ImpulseArray impulses;
    surfl->getImpulses(PathDirection::EYE_TO_SOURCE,-ray.direction(),impulses);
    for(int i = 0; i < impulses.size(); ++i) {
        const G3D::Surfel::Impulse& impulse = impulses[i];
        Ray secondaryRay = Ray::fromOriginAndDirection(surfl->position,impulse.direction).bumpedRay(.0001f);
        std::shared_ptr<Surfel> nextSurfl;
        float f;
        bool hit = m_world->intersect(secondaryRay,f,nextSurfl);
        if(hit) {
            L_o += nextSurfl->emittedRadiance(-secondaryRay.direction()) * impulse.magnitude;
        }
    }
    return L_o;
}


void PathTracer::setWorld(World *world)
{
    m_world=world;
}

void PathTracer::setPTSettings(PTSettings settings)
{
    m_settings=settings;
}